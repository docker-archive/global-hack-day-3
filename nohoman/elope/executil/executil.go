package executil

import (
	"os"
        "os/exec"
        "fmt"
        "bytes"
	"strings"
)

var (
	verbose = false
)

func Run(exe string, args ...string) string {
        cmd := exec.Command(exe, args...)
        if verbose {
        //      cmd.Stdout = os.Stdout
        //      cmd.Stderr = os.Stderr
                // TODO: User logger and make this trace
                fmt.Printf("     [ %v %v ]\n", exe, strings.Join(args, " "))
        }
        var out bytes.Buffer
        var outE bytes.Buffer
        cmd.Stdout = &out
        cmd.Stderr = &outE
        err := cmd.Run()
        if err != nil {
                if outE.Len() > 0 {
                        fmt.Printf("Error occurred during execution: %s", outE.String())
                } else {
                        fmt.Printf("Exception occurred: %v", err.Error())
                }
                os.Exit(1)
        }
        return out.String()
}

