package run

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"strings"
	"os"
	"time"
        "github.com/craigbarrau/global-hack-day-3/nohoman/elope/common"
        "github.com/craigbarrau/global-hack-day-3/nohoman/elope/docker"
        "github.com/craigbarrau/global-hack-day-3/nohoman/elope/stringid"
)

var (
	verbose = false
)

func deploy(p common.Package, container string) {
	docker.Cp(p.DeployableURI, container, p.Destination)
	CreateDockerImage(p.DeployableURI, container, p.Destination)
}

func record(p common.Package, container string) {
	this_deploy_metadir := common.Deployments_metadir+"/"+container+"/"+p.ID
        deployments_metadir_exists,_ := common.Exists(this_deploy_metadir)
        // TODO: Error handling
        if deployments_metadir_exists != true {
                os.MkdirAll(this_deploy_metadir, 0777)
		if verbose {
                	fmt.Printf("Creating %v\n",common.Deployments_metadir)
		}
        }
	t := time.Now()
        mapD := map[string]string{"id": p.ID, "source-file": p.SourceFile, "deployable-uri": p.DeployableURI, "destination": p.Destination, "md5sum": p.Md5sum, "deployed": t.Format(time.RFC3339)}
        mapB, _ := json.Marshal(mapD)
	if verbose { 
        	fmt.Println(string(mapB))
	}

        d1 := []byte(string(mapB))
        error := ioutil.WriteFile(this_deploy_metadir+"/metadata.json", d1, 0644)
        if error != nil {
                fmt.Println(error)
                os.Exit(1)
        }
}

func Run(identifier, container string) {
        packages_metadir_exists,_ := common.Exists(common.Packages_metadir)
        var package_exists = false
	var existing_package = common.Package{}
        if packages_metadir_exists != true {
                os.MkdirAll(common.Packages_metadir, 0777)
                // Make this debug log
                fmt.Printf("Creating %v\n",common.Packages_metadir)
        } else {
                files,_ := ioutil.ReadDir(common.Packages_metadir)
                for i := 0; i < len(files); i++ {
                        folder := files[i]
                        metadata_file := common.Packages_metadir+"/"+folder.Name()+"/metadata.json"
			p_meta_matches := strings.HasPrefix(folder.Name(), identifier) 
                        p_meta_exists,_ := common.Exists(metadata_file)
                        if p_meta_exists && p_meta_matches {
                                p,_ := common.ReadPackageJSON(metadata_file)
                                package_exists = true
				existing_package = p
                        } else {
                                // Write debugging messages here?`
                        }
                }
        }
        if package_exists {
		record(existing_package,container)
		deploy(existing_package,container)
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
	common.Cp(file, tmp_docker_context+"/"+filename)	
		
	dfile := CreateDockerFile(image_name, filename, destination, tmp_docker_context)
	if verbose {
	        fmt.Printf("Temporary Dockerfile at %v\n",dfile.Name())       	
	}
        docker.Build(dfile, container, "latest", tmp_docker_context) 
	// Run Docker tag as <image name>_<container name>:latest
	// TODO: accept -t imagename:tag
	// Implement push when the flag is set
	//docker.Push(container, "latest")
	//os.RemoveAll(tmp_docker_context)	 
}

func CreateDockerFile(image_name, filename, destination, tmp_build_context string) *os.File {
	contents := "FROM "+image_name+"\nADD "+filename+" "+destination+"/"+filename
	fmt.Println(" d - Generating Dockerfile")
	if verbose {
        	fmt.Printf("### BEGIN FILE\n%v\n### END FILE\n", contents)
	}
        dfile,_ := ioutil.TempFile(tmp_build_context, "Dockerfile")
        d1 := []byte(contents)
        error := ioutil.WriteFile(dfile.Name(), d1, 0644)		
        if error != nil {
                fmt.Println(error)
                os.Exit(1)
        }
	return dfile	
}
