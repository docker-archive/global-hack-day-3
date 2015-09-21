package godoauth

import (
	"crypto/tls"
	"fmt"
	"log"
	"net"
	"net/http"
	"time"
)

var clientTimeout time.Duration

type Server struct {
	Server   http.Server
	Listener net.Listener
	Handler  http.Handler
	// used for proper graceful closing TODO
	closing chan struct{}
	// main Auth config file
	Config *Config
}

// NewServer returns a new instance of Server built from a config.
func NewServer(c *Config) (*Server, error) {
	// BUG(dejan) add support to write logs to a text file
	//	if c.Log.File != "" {
	//		// BUG(dejan): Implement file handler
	//		s.Handler = handlers.CombinedLoggingHandler(os.Stdout, s.Handler)
	//	} else {
	//		s.Handler = handlers.CombinedLoggingHandler(os.Stdout, s.Handler)
	//	}

	var (
		l   net.Listener
		err error
	)

	if c.HTTP.TLS.Certificate != "" && c.HTTP.TLS.Key != "" {
		cert, err := tls.LoadX509KeyPair(c.HTTP.TLS.Certificate, c.HTTP.TLS.Key)
		if err != nil {
			return nil, err
		}

		l, err = tls.Listen("tcp", c.HTTP.Addr, &tls.Config{
			Certificates: []tls.Certificate{cert},
		})
		if err != nil {
			log.Panic("Server Listen HTTPS Error: ", err)
		}
		log.Println("Listener on HTTPS:", l.Addr().String())
	} else {
		l, err = net.Listen("tcp", c.HTTP.Addr)
		if err != nil {
			log.Panic("Server Listen HTTP Error: ", err)
		}
		log.Println("Listener on HTTP:", l.Addr().String())
	}

	clientTimeout, err := time.ParseDuration(c.HTTP.Timeout)
	if err != nil {
		return nil, fmt.Errorf("error parsing client timeout: %v", err)
	}

	authHandler := &TokenAuthHandler{
		Client: &http.Client{
			Timeout: clientTimeout,
		},
		Config: c,
	}

	mux := http.NewServeMux()
	mux.Handle("/auth", authHandler)
	mux.HandleFunc("/server-ping", serverPing)

	return &Server{
		closing:  make(chan struct{}),
		Config:   c,
		Handler:  mux,
		Listener: l,
	}, nil
}

//serverPing is an health check handler, so we can use ELB/HA proxy health check
func serverPing(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte("{\"message\": \"Save the Whales !\"}\n\r"))
}

//Start the Token Authentication server
func (s *Server) Start() {
	go func() {
		defer s.Listener.Close()
		s.Server = http.Server{Handler: s.Handler}
		if err := s.Server.Serve(s.Listener); err != nil {
			log.Panic("Server: ", err)
		}
	}()
}
