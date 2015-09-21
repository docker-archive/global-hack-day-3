package common

import (
	"os"
	"io"
	"io/ioutil"
	"fmt"
	"encoding/json"
        "time"
)

var (
        // TODO: Productise this path (e.g. /var/lib/elope)
        persistence_store = "/tmp/elope"
        Packages_metadir = persistence_store+"/packages"
	Deployments_metadir = persistence_store+"/deployments"
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
        // Deployed timestamp when image was created
        Deployed time.Time `json:"deployed"`
        // Destination
        Destination string `json:"destination,omitempty"`
        // Author
        Author string `json:"author,omitempty"`
        // OS is the operating system used to build and run the deployable
        OS string `json:"os,omitempty"`
        // MD5sum
        Md5sum string `json:"md5sum"`
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

func Exists(path string) (bool, error) {
        _, err := os.Stat(path)
        if err == nil { return true, nil }
        if os.IsNotExist(err) { return false, nil }
        return true, err
}

func Cp(src, dst string) error {
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
