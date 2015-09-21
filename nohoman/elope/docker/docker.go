package docker

import (
        "fmt"
	"os"
        "github.com/craigbarrau/global-hack-day-3/nohoman/elope/executil"
)

func Cp(file, container, destination string) {
        fmt.Printf("1  - Deploying %v to %v:%v\n", file, container, destination)
        executil.Run("sudo", "docker", "cp", file, container+":"+destination)
}

func Build(dockerfile *os.File, image, tag, context string) {
	fmt.Printf(" e - Building image %v:%v\n", image, tag)
	executil.Run("sudo", "docker", "build", "-t", image+":"+tag, "-f", dockerfile.Name(), context)	
}

func Push(image, tag string){
	fmt.Printf("\n f - Pushing image %v:%v\n", image, tag) 
}

func PsFilterFormat(filter, format string) string {
        image_name := executil.Run("sudo", "docker", "ps", "--filter="+filter, "--format=\""+format+"\"")
	return image_name
}

