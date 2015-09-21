package godoauth

import (
	"fmt"
	"net/http"
)

type HTTPAuthError struct {
	err  string
	Code int
}

// Predefined internal error
var (
	ErrUnauthorized *HTTPAuthError = NewHTTPError("Unauthorized Access", http.StatusUnauthorized)
	ErrForbidden                   = NewHTTPError("Forbiden Access", http.StatusForbidden)
	ErrInternal                    = NewHTTPError("Internal server error", http.StatusInternalServerError)
)

// HTTPBadRequest returns *HTTPError with supplied informative string and error code 400.
func HTTPBadRequest(s string) (err *HTTPAuthError) {
	return NewHTTPError(s, http.StatusBadRequest)
}

// NewHTTPError creates new HTTPError with supplied error message and code.
// The message is displayed to the end user, so please be careful.
func NewHTTPError(s string, code int) (err *HTTPAuthError) {
	return &HTTPAuthError{s, code}
}

func (e HTTPAuthError) Error() string {
	return fmt.Sprintf("%d: %v", e.Code, e.err)
}

// Respond sends the error code and message to the supplied ResponseWriter
func (e *HTTPAuthError) Respond(w http.ResponseWriter) {
	http.Error(w, e.err, e.Code)
}
