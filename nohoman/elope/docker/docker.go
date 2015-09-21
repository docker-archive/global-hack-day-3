package docker

import (
        "os/exec"
        "fmt"
        "bytes"
	"strings"
	"os"
)

var (
	verbose = true
)

func Cp(file, container, destination string) {
        fmt.Printf("1  - Copying %v to %v:%v\n", file, container, destination)
        do("sudo", "docker", "cp", file, container+":"+destination)
}

func Build(dockerfile *os.File, image, tag string) {
	fmt.Printf("\n c - Building image %v:%v\n", image, tag)
	do("sudo", "docker", "build", "-t", image+":"+tag, "-f", dockerfile.Name(), ".")	
}

func Push(image, tag string){
	fmt.Printf("\n d - Pushing image %v:%v\n", image, tag) 
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
