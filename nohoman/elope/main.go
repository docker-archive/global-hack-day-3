package main

import (
	"strings"
	"encoding/json"
	"os"
	"path/filepath"
	"fmt"
	"time"
	"io/ioutil"
	"github.com/craigbarrau/global-hack-day-3/nohoman/elope/docker"
        "github.com/craigbarrau/global-hack-day-3/nohoman/elope/executil"
        "github.com/craigbarrau/global-hack-day-3/nohoman/elope/stringid"
	"github.com/craigbarrau/global-hack-day-3/nohoman/elope/run"
	"github.com/craigbarrau/global-hack-day-3/nohoman/elope/common"
	"github.com/craigbarrau/global-hack-day-3/nohoman/elope/diff"
)

var (
	verbose = false
)

const (
	stop_action = "retreat"
	pack_action = "pack"
	run_action = "run"
	ls_action = "ls"
	diff_action = "diff"

	// TODO: Productise this path (e.g. /var/lib/elope)
	persistence_store = "/tmp/elope"
        packages_metadir = persistence_store+"/packages"
	tomcat = "/usr/local/tomcat/webapps" 
)

// NewPackageJSON creates an Package configuration from json.
func NewPackageJSON(src []byte) (*common.Package, error) {
	ret := &common.Package{}
	if err := json.Unmarshal(src, ret); err != nil {
		return nil, err
	}
	return ret, nil
}

func Pack(file, destination string) string {
        packages_metadir_exists,_ := common.Exists(packages_metadir)
        // TODO: Error handling
	var package_exists = false
	var existing_package_id = ""
        currentmd5sumfull := md5sum(file)
        if packages_metadir_exists != true {
                os.MkdirAll(packages_metadir, 0777)
                if verbose {
                	fmt.Printf("Creating %v\n",packages_metadir)
		}
        } else {
	        files,_ := ioutil.ReadDir(packages_metadir)
		for i := 0; i < len(files); i++ {
			folder := files[i]
			metadata_file := packages_metadir+"/"+folder.Name()+"/metadata.json"	
			if verbose { fmt.Printf("Reading %v\n",metadata_file) }
			p_meta_exists,_ := common.Exists(metadata_file)
			if p_meta_exists == true {
				p,_ := common.ReadPackageJSON(metadata_file)
				if verbose { fmt.Printf("Comparing %v with %v\n",file,p.SourceFile) }	
				savedmd5 := strings.Split(p.Md5sum," ")[0]
				currentmd5 := strings.Split(currentmd5sumfull," ")[0]
				if verbose {
					fmt.Println(savedmd5)
					fmt.Println(currentmd5)
				}
				if p.SourceFile == file && savedmd5 == currentmd5 {
					package_exists = true
					existing_package_id = p.ID				
					break
				}
			} 
		}
	}

	if package_exists {
		return existing_package_id
	}

	id := stringid.GenerateRandomID()
	// Replace os-dependent implementation with the one above
	//id, err := exec.Command("uuidgen").Output()
	//if err != nil {
	//	fmt.Println("Issue accessing uuidgen")
	//	os.Exit(1)
	//}

	// Move the writing of Package JSON to a separate function
	t := time.Now()
	sanitised_id := string(id)[:len(id)-1]

        this_package_metadir := packages_metadir+"/"+sanitised_id
        this_package_metadir_exists,_ := common.Exists(this_package_metadir)
        // TODO: Error handling
        if this_package_metadir_exists != true {
                os.MkdirAll(this_package_metadir, 0777)
                // Make this debug log
                fmt.Printf("Creating %v\n",this_package_metadir)
        } else {
                fmt.Println(packages_metadir+" exists! This should never happen. Exiting...")
                os.Exit(1)
        }	

        filepieces := strings.Split(file, "/")
        filename := filepieces[len(filepieces)-1]

        contents_cached := this_package_metadir+"/"+filename

        abs_file,_ := filepath.Abs(file)
        common.Cp(abs_file, contents_cached)
        md5sum := md5sum(contents_cached)

	mapD := map[string]string{"id": sanitised_id, "source-file": abs_file, "deployable-uri": contents_cached, "destination": destination, "create": t.Format(time.RFC3339), "md5sum": md5sum}
	mapB, _ := json.Marshal(mapD)
	fmt.Println(string(mapB))

	d1 := []byte(string(mapB))
	error := ioutil.WriteFile(this_package_metadir+"/metadata.json", d1, 0644)	
        if error != nil {
		fmt.Println(error)
		os.Exit(1)
	}

	return sanitised_id
}

func md5sum(contents_cached string) string {
	output := executil.Run("md5sum", contents_cached)
	return output[:len(output)-1]
}

func CreateDockerImage(file, container, destination string) {
	fmt.Println("\n2  - Commencing creation of new Docker image identical to patch")
	// Make this part of debug
        fmt.Println(" a - Retrieving image for running container")
	image_name := docker.PsFilterFormat("[name="+container+"]","{{.Image}}")


	fmt.Println(" b - Creating temporary Docker context")
	id := stringid.GenerateRandomID()
	tmp_docker_context := "/tmp/"+id
	os.MkdirAll(tmp_docker_context, 0777)
        filepieces := strings.Split(file, "/")
        filename := filepieces[len(filepieces)-1]

	fmt.Println(" c - Pulling snapshot package into Docker context")
	common.Cp(file, tmp_docker_context+"/"+filename)	
		
	dfile := CreateDockerFile(image_name, filename, destination, tmp_docker_context)
        // Make this part of debug
        fmt.Printf("Temporary Dockerfile at %v\n",dfile.Name())       	
        docker.Build(dfile, container, "latest", tmp_docker_context) 
	// Run Docker tag as <image name>_<container name>:latest
	// TODO: accept -t imagename:tag
	// Implement push when the flag is set
	//docker.Push(container, "latest")
	//os.RemoveAll(tmp_docker_context)	 
}

func CreateDockerFile(image_name, filename, destination, tmp_build_context string) *os.File {
	contents := "FROM "+image_name+"\nADD "+filename+" "+destination+"/"+filename
        fmt.Printf("\n d - Generating Dockerfile\n### BEGIN FILE\n%v\n### END FILE\n", contents)
        dfile,_ := ioutil.TempFile(tmp_build_context, "Dockerfile")
        d1 := []byte(contents)
        error := ioutil.WriteFile(dfile.Name(), d1, 0644)		
        if error != nil {
                fmt.Println(error)
                os.Exit(1)
        }
	return dfile	
}

func main() {
	var Usage = func() {
		fmt.Fprintf(os.Stderr, "Usage: %s COMMAND [arg...] [OPTIONS]\n", os.Args[0])
		fmt.Println("\nFast and flexible Docker deployments without the ceremony\n")
		fmt.Println("Commands:")
		fmt.Println("    pack     Pack for incremental or full deployment")
		fmt.Println("    run      Escape it all and deploy the way you want")
		fmt.Println("    diff     See the differences made to the container from elope") 
		fmt.Println("")
	}
	args := os.Args[1:]
	numArgs := len(args)
	if numArgs < 1 {
		Usage()
		os.Exit(1)
	}
        action := args[0]
        if action == pack_action {
		if numArgs < 3 {
			fmt.Fprintf(os.Stderr, "Usage: %s %s FILE DESTINATION\n", os.Args[0], action)	
			fmt.Println("\nPack for incremental or full deployment\n")
			fmt.Println("Inputs:")
			fmt.Println("    FILE         Filepath URI for an accessible deployable artifact")
			fmt.Println("    DESTINATION  Destination of the file on the target container(s)")
			fmt.Println("                 You can choose to set this later at deploy-time - i.e. 'elope run'")
			fmt.Println("")
			os.Exit(1)
		}
		file := args[1]
		var destination = args[2]
		if verbose { fmt.Printf("Using destination %v\n", destination) }
		id := Pack(file, destination)
		fmt.Println(id)
	} else if action == run_action {
                if numArgs < 3 {
                        fmt.Fprintf(os.Stderr, "Usage: %s %s PACKAGE CONTAINER\n", os.Args[0], action)
			fmt.Println("\nEscape it all and deploy the way you want\n")
                        fmt.Println("Inputs:")
                        fmt.Println("    PACKAGE    The identifier for the package")
                        fmt.Println("    CONTAINER  The identifier for container to deploy to.")
			fmt.Println("               It can be the name or id of the docker container")
                        fmt.Println("")
                        os.Exit(1)
                }
		id := args[1]
		var container = ""
		//if numArgs > 2 {
			container = args[2]
		//}
		run.Run(id, container)
	} else if action == diff_action {
                if numArgs < 2 {
                        fmt.Fprintf(os.Stderr, "Usage: %s %s CONTAINER\n", os.Args[0], action)
                        fmt.Println("\nSee the differences made to your container from elope")
			fmt.Println("This can more useful then 'docker diff' as it shows only deployment changes")
			fmt.Println("No the insignificant/irrelevant data like log files/n")
                        fmt.Println("Inputs:")
                        fmt.Println("    CONTAINER  The identifier for container that has been deploy to.")
                        fmt.Println("               It can be the name or id of the docker container")
                        fmt.Println("")
                        os.Exit(1)
                }		
		container := args[1]
	} else {
		fmt.Println(action+" is not yet implemented or it may never be.")
	}
}
