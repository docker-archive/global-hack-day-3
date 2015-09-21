package main

import (
	"fmt"
	"net"
	"net/http"
	"strings"
	"net/url"
	"errors"
	"io"
	"io/ioutil"
	"encoding/json"
	"bufio"
	"bytes"
	"encoding/binary"
	"net/http/httputil"
	"log"
)

const userAgent = "docker-multi-tenancy"
const logResponse bool = true

var (
	// ErrInvalidEndpoint is returned when the endpoint is not a valid HTTP URL.
	ErrInvalidEndpoint = errors.New("invalid endpoint")

	ErrConnectionRefused = errors.New("Connection refused")
)


// APIImages represent an image returned in the ListImages call.
type APIImages struct {
	ID          string            `json:"Id" yaml:"Id"`
	RepoTags    []string          `json:"RepoTags,omitempty" yaml:"RepoTags,omitempty"`
	Created     int64             `json:"Created,omitempty" yaml:"Created,omitempty"`
	Size        int64             `json:"Size,omitempty" yaml:"Size,omitempty"`
	VirtualSize int64             `json:"VirtualSize,omitempty" yaml:"VirtualSize,omitempty"`
	ParentID    string            `json:"ParentId,omitempty" yaml:"ParentId,omitempty"`
	RepoDigests []string          `json:"RepoDigests,omitempty" yaml:"RepoDigests,omitempty"`
	Labels      map[string]string `json:"Labels,omitempty" yaml:"Labels,omitempty"`
}

type Client struct{
	endpoint            string
	endpointURL         *url.URL
	unixHTTPClient      *http.Client
	dialer              func(string, string) (net.Conn, error)
}


// Error represents failures in the API. It represents a failure from the API.
type Error struct {
	Status  int
	Message string
}

func (e *Error) Error() string {
	return fmt.Sprintf("API error (%d): %s", e.Status, e.Message)
}


var (
	localAddrString  = ":9000"
	unixDockerSocket = "unix:///var/run/docker.sock"

)



func dockerRequestHandler(rqTransformers map[string]func(r *http.Request), rsTransformers map[string]func(r *http.Response)) http.Handler {
	fn := func(w http.ResponseWriter, r *http.Request) {
		log.Println("Recieved methos ", r.Method, " url", r.URL)
		c, err := newClient(unixDockerSocket)

		if err != nil {
			w.Write([]byte("Error"))
			return
		}

		for k, f := range rqTransformers{
			if k == r.URL.String() {
				log.Println("Applixing expresion ", k)
				f(r)
			}else{
				log.Println("No matching for ", k, " and ", r.URL.String())
			}
		}

		// TODO needs to accept POST content
		resp, err := c.do( r.Method,  r.URL.String(), r.Body)

		if err != nil {
			w.Write([]byte("Error"))
			return
		}

		for k, f := range rsTransformers{
			if k == r.URL.String() {
				log.Println("Applixing expresion ", k)
				f(resp)
			}else{
				log.Println("No matching for ", k, " and ", r.URL.String())
			}
		}

		defer resp.Body.Close()

		content, _ := ioutil.ReadAll(resp.Body)

		w.Write(content)
	}
	return http.HandlerFunc(fn)
}

// NewVersionedClient returns a Client instance ready for communication with
// the given server endpoint
func newClient(endpoint string) (*Client, error) {
	u, err := url.Parse(endpoint)

	if err != nil {
		return nil, ErrInvalidEndpoint
	}

	d := net.Dialer{}
	dialFunc := func(network, addr string) (net.Conn, error) {
		return d.Dial("unix", u.Path)
	}
	unixHTTPClient := &http.Client{
		Transport: &http.Transport{
			Dial: dialFunc,
		},
	}

	return &Client{
		unixHTTPClient:      unixHTTPClient,
		endpoint:            endpoint,
		endpointURL:         u,
		dialer:				 dialFunc,
	}, nil
}

// getFakeUnixURL returns the URL needed to make an HTTP request over a UNIX
// domain socket to the given path.
func (c *Client) getFakeUnixURL(path string) string {
	u := *c.endpointURL // Copy.

	// Override URL so that net/http will not complain.
	u.Scheme = "http"
	u.Host = "unix.sock" // Doesn't matter what this is - it's not used.
	u.Path = ""

	urlStr := strings.TrimRight(u.String(), "/")

	return fmt.Sprintf("%s%s", urlStr, path)
}


func (c *Client) do(method, path string, body io.Reader) (*http.Response, error) {
	var u string

	httpClient := c.unixHTTPClient
	u = c.getFakeUnixURL(path)


	req, err := http.NewRequest(method, u, body)
	if err != nil {
		return nil, err
	}
	req.Header.Set("User-Agent", userAgent)

	if method == "POST" {
		req.Header.Set("Content-Type", "application/json")
	}

	resp, err := httpClient.Do(req)

	if logResponse {
		if respBytes, err := httputil.DumpResponse(resp, true); err == nil {
			log.Printf("Response:\n%v\n", string(respBytes))
		}

	}
	if err != nil {
		if strings.Contains(err.Error(), "connection refused") {
			return nil, ErrConnectionRefused
		}
		return nil, err
	}

	if resp.StatusCode < 200 || resp.StatusCode >= 400 {
		return nil, newError(resp)
	}
	return resp, nil
}

func newError(resp *http.Response) *Error {
	defer resp.Body.Close()
	data, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return &Error{Status: resp.StatusCode, Message: fmt.Sprintf("cannot read body, err: %v", err)}
	}
	return &Error{Status: resp.StatusCode, Message: string(data)}
}


func main(){

	log.Println("Starting multi-tenancy proxy listening at: ", localAddrString)

	fReq := func(r *http.Request){
		log.Println("Modifiy somehow the request")
	}

	fRes := func(r *http.Response){
		log.Println("Modifiy somehow the response")

		// Parse the response

		var images []APIImages

		if err := json.NewDecoder(r.Body).Decode(&images); err != nil {
			return
		}

		for _, im :=  range images{

			if im.Labels == nil {
				im.Labels = make(map[string]string)
			}

			im.Labels["hola"] = "world"
		}


		var b bytes.Buffer
		w := bufio.NewWriter(&b)

		// Now take the struct and encode it
		if err := json.NewEncoder(w).Encode(&images); err != nil {
			return
		}

		// Restore the io.ReadCloser to its original state
		r.Body = ioutil.NopCloser(bytes.NewBuffer(b.Bytes()))

		// Set size of modified body
		r.ContentLength = int64(binary.Size(b))
	}

	rqTransformers := make(map[string]func(r *http.Request))

	rqTransformers["/v1.20/images/json"] = fReq

	rsTransformers := make(map[string]func(r *http.Response))

	rsTransformers["/v1.20/images/json"] = fRes

	http.ListenAndServe(localAddrString, dockerRequestHandler(rqTransformers, rsTransformers))

}

