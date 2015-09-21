package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"os/signal"
	"regexp"
	"strings"
)

func main() {
	var services []Service

	os.RemoveAll("./services")

	spacerfile, err := ioutil.ReadFile("Spacerfile")
	if err != nil {
		log.Fatal(err)
	}
	lines := strings.Split(string(spacerfile), "\n")
	for _, l := range lines {
		s, err := NewService("services", l)
		if err != nil {
			continue
		}
		err = s.Clone()
		if err != nil && err != ErrLocalPathAlreadyExists {
			log.Panic(err)
		}
		services = append(services, s)

		// docker-compose build && docker-compose up
		dcb, err := s.Build()
		fmt.Println(string(dcb))
		if err != nil {
			log.Panic(err)
		}

		s.Start()
		/*

			time.Sleep(3 * time.Second)

			dcs, err := s.Stop()
			if err != nil {
				log.Panic(err)
			}
			fmt.Println(string(dcs))

		*/
	}

	// setup a proxy for each service
	for _, s := range services {
		// TODO not just web
		prefix := "/" + s.Name
		fmt.Printf("Proxying %s to %s\n", prefix, s.ExposedURLs["web"])
		proxy := httputil.NewSingleHostReverseProxy(s.ExposedURLs["web"])
		proxy.Director = direct(prefix, s.ExposedURLs["web"])
		http.HandleFunc(prefix, proxy.ServeHTTP)
	}

	signalChan := make(chan os.Signal, 1)
	signal.Notify(signalChan, os.Interrupt)
	go func() {
		for _ = range signalChan {
			fmt.Println("\nReceived an interrupt, stopping services...\n")
			for _, s := range services {
				output, err := s.Stop()
				if err != nil {
					fmt.Println(err)
				}
				fmt.Println(string(output))
			}
			os.Exit(0)
		}
	}()

	fmt.Println("\nSpacer is ready and rocking at 0.0.0.0:9064")
	http.ListenAndServe(":9064", nil)
}

func direct(prefix string, target *url.URL) func(req *http.Request) {
	regex := regexp.MustCompile(`^` + prefix)
	return func(req *http.Request) {
		targetQuery := target.RawQuery
		req.URL.Scheme = target.Scheme
		req.URL.Host = target.Host
		req.URL.Path = regex.ReplaceAllString(singleJoiningSlash(target.Path, req.URL.Path), "")
		if targetQuery == "" || req.URL.RawQuery == "" {
			req.URL.RawQuery = targetQuery + req.URL.RawQuery
		} else {
			req.URL.RawQuery = targetQuery + "&" + req.URL.RawQuery
		}
	}
}

func singleJoiningSlash(a, b string) string {
	aslash := strings.HasSuffix(a, "/")
	bslash := strings.HasPrefix(b, "/")
	switch {
	case aslash && bslash:
		return a + b[1:]
	case !aslash && !bslash:
		return a + "/" + b
	}
	return a + b
}
