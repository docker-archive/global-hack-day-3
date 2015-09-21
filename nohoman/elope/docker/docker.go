package docker

import (
        "os/exec"
        "fmt"
        "bytes"
	"strings"
	"os"
        "github.com/craigbarrau/global-hack-day-3/nohoman/elope/executil"
)

var (
	verbose = true
)

func Cp(file, container, destination string) {
        fmt.Printf("1  - Deploying %v to %v:%v\n", file, container, destination)
        executil.Run("sudo", "docker", "cp", file, container+":"+destination)
}

func Build(dockerfile *os.File, image, tag, context string) {
	fmt.Printf("\n e - Building image %v:%v\n", image, tag)
	do("sudo", "docker", "build", "-t", image+":"+tag, "-f", dockerfile.Name(), context)	
}

func Push(image, tag string){
	fmt.Printf("\n f - Pushing image %v:%v\n", image, tag) 
}

func PsFilterFormat(filter, format string) string {
        image_name,_ := do("sudo", "docker", "ps", "--filter="+filter, "--format=\""+format+"\"")
	return image_name
}

func do(exe string, args ...string) (string, error) {
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
