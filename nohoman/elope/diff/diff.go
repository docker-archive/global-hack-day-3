package diff

import (
	"io/ioutil"
	"strings"
	"fmt"
        "github.com/craigbarrau/global-hack-day-3/nohoman/elope/common"
)

var (
	verbose = false
)

type StringSet struct {
	set map[string]bool
}

func NewStringSet() *StringSet {
	return &StringSet{make(map[string]bool)}
}

func (set *StringSet) Add(i string) bool {
	_, found := set.set[i]
	set.set[i] = true
	return !found	//False if it existed already
}

func (set *StringSet) Get(i string) bool {
	_, found := set.set[i]
	return found	//true if it existed already
}

func (set *StringSet) Remove(i string) {
	delete(set.set, i)
}

func Diff(container string) {
	this_deploy_metadir := common.Deployments_metadir+"/"+container
        deployments_metadir_exists,_ := common.Exists(this_deploy_metadir)
        if deployments_metadir_exists {
		changed_files := NewStringSet()
                files,_ := ioutil.ReadDir(this_deploy_metadir)
                for i := 0; i < len(files); i++ {
                        folder := files[i]
                        metadata_file := this_deploy_metadir+"/"+folder.Name()+"/metadata.json"
			if verbose {
                        	fmt.Printf("Reading %v\n",metadata_file)
			}
                        p_meta_exists,_ := common.Exists(metadata_file)
                        if p_meta_exists == true {
                                p,_ := common.ReadPackageJSON(metadata_file)
			        filepieces := strings.Split(p.SourceFile, "/")
			        filename := filepieces[len(filepieces)-1]
				destinationpath := p.Destination+"/"+filename
				if changed_files.Get(destinationpath) {
					if verbose {
						fmt.Printf("%v has been deployed multiple times",destinationpath)
					}
				} else {
					changed_files.Add(destinationpath)
					fmt.Printf("C %v\n",destinationpath)
				}
                        }
                }
        } else {
		fmt.Println("No previous deployed for container %v",container)
	}	
}
