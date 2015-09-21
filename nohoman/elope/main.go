package main

import (
	"strings"
	"encoding/json"
	"os"
	"path/filepath"
	"fmt"
	"time"
	"io"
	"io/ioutil"
	"github.com/craigbarrau/global-hack-day-3/nohoman/elope/docker"
        "github.com/craigbarrau/global-hack-day-3/nohoman/elope/executil"
        "github.com/craigbarrau/global-hack-day-3/nohoman/elope/stringid"
)

var (
	verbose = true
)

const (
	stop_action = "retreat"
	pack_action = "pack"
	run_action = "run"
	ls_action = "ls"

	// TODO: Productise this path (e.g. /var/lib/elope)
	persistence_store = "/tmp/elope"
        packages_metadir = persistence_store+"/packages"
	tomcat = "/usr/local/tomcat/webapps" 
)

type Package struct {
	// ID a unique 64 character identifier of the image
	ID string `json:"id"`
	//DeployableURI the cached deployment URI
	DeployableURI string `json:"deployable-uri"`	
	// SourceFile the source of the file on the local filesystem
	SourceFile string `json:"source-file"`
	// Comment user added comment
	Comment string `json:"comment,omitempty"`
	// Created timestamp when image was created
	Created time.Time `json:"created"`
	// Destination
	Destination string `json:"destination,omitempty"`
	// Author
	Author string `json:"author,omitempty"`
	// OS is the operating system used to build and run the deployable
	OS string `json:"os,omitempty"`
	// MD5sum
	Md5sum string `json:"md5sum"`	
}

// NewPackageJSON creates an Package configuration from json.
func NewPackageJSON(src []byte) (*Package, error) {
	ret := &Package{}
	if err := json.Unmarshal(src, ret); err != nil {
		return nil, err
	}
	return ret, nil
}

func ReadPackageJSON(file string) (Package, error) {
        packageJSON, err := ioutil.ReadFile(file)
        if err != nil {
                fmt.Printf("Error reading file: %v", err)
                return Package{}, err
        }
        var p Package
        error := json.Unmarshal(packageJSON, &p)
        if error != nil {
                fmt.Printf("Error reading json: %v", error)
                return Package{}, error
        }
	return p, nil
}

func cp(src, dst string) error {
	s, err := os.Open(src)
	if err != nil {
		return err
	}
	// no need to check errors on read only file, we already got everything
	// we need from the filesystem, so nothing can go wrong now.
	defer s.Close()
	d, err := os.Create(dst)
	if err != nil {
		return err
	}
	if _, err := io.Copy(d, s); err != nil {
		d.Close()
		return err
	}
	return d.Close()
}

func Pack(name, file, destination string) string {
        packages_metadir_exists,_ := exists(packages_metadir)
        // TODO: Error handling
	var package_exists = false
	var existing_package_id = ""
        currentmd5sumfull := md5sum(file)
        if packages_metadir_exists != true {
                os.MkdirAll(packages_metadir, 0777)
                // Make this debug log
                fmt.Printf("Creating %v\n",packages_metadir)
        } else {
	        files,_ := ioutil.ReadDir(packages_metadir)
		for i := 0; i < len(files); i++ {
			folder := files[i]
			metadata_file := packages_metadir+"/"+folder.Name()+"/metadata.json"	
			fmt.Printf("Reading %v\n",metadata_file)
			p_meta_exists,_ := exists(metadata_file)
			if p_meta_exists == true {
				p,_ := ReadPackageJSON(metadata_file)
				fmt.Printf("Comparing %v with %v\n",file,p.SourceFile)	
				savedmd5 := strings.Split(p.Md5sum," ")[0]
				currentmd5 := strings.Split(currentmd5sumfull," ")[0]
				fmt.Println(savedmd5)
				fmt.Println(currentmd5)
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
        this_package_metadir_exists,_ := exists(this_package_metadir)
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
        cp(abs_file, contents_cached)
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
	output,_ := executil.Run("md5sum", contents_cached)
	return output[:len(output)-1]
}

func exists(path string) (bool, error) {
	_, err := os.Stat(path)
	if err == nil { return true, nil }
	if os.IsNotExist(err) { return false, nil }
	return true, err
}

func Run(identifier, container string) {
        packages_metadir_exists,_ := exists(packages_metadir)
        // TODO: Error handling
        var package_exists = false
	var existing_package = Package{}
        if packages_metadir_exists != true {
                os.MkdirAll(packages_metadir, 0777)
                // Make this debug log
                fmt.Printf("Creating %v\n",packages_metadir)
        } else {
                files,_ := ioutil.ReadDir(packages_metadir)
                for i := 0; i < len(files); i++ {
                        folder := files[i]
                        metadata_file := packages_metadir+"/"+folder.Name()+"/metadata.json"
			p_meta_matches := strings.HasPrefix(folder.Name(), identifier) 
                        p_meta_exists,_ := exists(metadata_file)
                        if p_meta_exists && p_meta_matches {
                                p,_ := ReadPackageJSON(metadata_file)
                                package_exists = true
				existing_package = p
                        } else {
                                // Write debugging messages here?`
                        }
                }
        }
	if package_exists {
		p := existing_package
		docker.Cp(p.DeployableURI, container, p.Destination)
		CreateDockerImage(p.DeployableURI, container, p.Destination)
	} else {
		fmt.Printf("No package found matching %v\n", identifier)	
		os.Exit(1)
	}
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
	cp(file, tmp_docker_context+"/"+filename)	
		
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
		fmt.Println("    ls       List all pending or active deployments")
		fmt.Println("    retreat  ...so it didn't work out for you?") 
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
		var destination = ""
		//if numArgs > 2 {
			destination = args[2]
			fmt.Printf("Using destination %v\n", destination)
		//}
		id := Pack("random_name", file, destination)
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
		Run(id, container)
	} else if action == ls_action {
	// TODO:
	// Implement ls. By searching path /tmp/packages/
	// Package ID | File | Destination | Latest | Pending Changes
	// Implement watch.
	// Implement retreat to delete packages single or all 
	// Implement copy of pack so that it is a snapshot
	// Implement destination container@<destination>
	// Implement technology drivers
	} else {
		fmt.Println(action+" is not yet implemented or it may never be.")
	}
}
