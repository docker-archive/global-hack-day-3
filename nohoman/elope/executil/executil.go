package executil

import (
        "os/exec"
        "fmt"
        "bytes"
	"strings"
)

var (
	verbose = true
)

func Run(exe string, args ...string) (string, error) {
        cmd := exec.Command(exe, args...)
        if verbose {
        //      cmd.Stdout = os.Stdout
        //      cmd.Stderr = os.Stderr
                // TODO: User logger and make this trace
                fmt.Printf("     [ %v %v ]\n", exe, strings.Join(args, " "))
        }
        var out bytes.Buffer
        cmd.Stdout = &out
        err := cmd.Run()
        if err != nil {
                return out.String(), err
        }
        return out.String(), nil
}
