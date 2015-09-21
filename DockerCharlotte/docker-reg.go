package main

import (
 "encoding/json"
  "fmt"
  "github.com/codegangsta/cli"
  "io/ioutil"
  "log"
  "net/http"
  "os"
  "strings"
)

func main() {
  app := cli.NewApp()
  app.Name = "docker-reg"
  app.Version = "0.0.1"
  app.Usage = "CLI to list/remove repositories and repository tags from a private Docker registry"
  app.Action = func(c *cli.Context) {
    println("For usage:\n\t",app.Name,"help")
  }

  /**
   * Define flags
   */
  app.Flags = []cli.Flag {
    cli.StringFlag{
      Name: "domain, d",
      Usage: "Hostname for private registry, example: registry.mydomain.com.",
    },
    cli.StringFlag{
      Name: "port, p",
      Value: "443",
      Usage: "Port for private registry, default: 443",
    },
    cli.StringFlag{
      Name: "scheme, s",
      Value: "https",
      Usage: "Scheme for private registry, default: https",
    },
    cli.StringFlag{
      Name: "user, u",
      Usage: "Username for private registry",
    },
    cli.StringFlag{
      Name: "pass, x",
      Usage: "Password for private registry",
      EnvVar: "DOCKER_REGISTRY_PASSWORD",
    },
  }

  /**
   * Define sub commands
   */
  app.Commands = []cli.Command{
    {
      Name:    "lsr",
      Usage:   "List repositories",
      Flags: app.Flags,
      Action:  func(c *cli.Context) {
        println(listRepositories(c))
      },
    },
    {
      Name:    "rmr",
      Usage:   "Remove repository",
      Flags: app.Flags,
      Action:  func(c *cli.Context) {
        repoName := c.Args()[0]
        if repoName == ""{
          println("You must supply a repository name")
          return
        }
        tagName := c.Args()[1]
        if tagName == ""{
          println("You must supply a tag name")
          return
        }
        println(deleteRepository(c, repoName, tagName))
      },
    },
    {
      Name:    "lst",
      Usage:   "List tags for repository",
      Flags: app.Flags,
      Action:  func(c *cli.Context) {
        repoName := c.Args().First()
        if repoName == ""{
          println("You must supply a repository name")
          return
        }
        println(listTagsForRepository(c, repoName))
      },
    },
    // {
    //   Name:    "rmt",
    //   Usage:   "Remove tag for image",
    //   Flags: app.Flags,
    //   Action:  func(c *cli.Context) {
    //     println("Do the work of removing a tag for an image")
    //   },
    // },
    // {
    //   Name:    "lsm",
    //   Usage:   "List manifests for repository and tag",
    //   Flags: app.Flags,
    //   Action:  func(c *cli.Context) {
    //     repoName := c.Args()[0]
    //     if repoName == ""{
    //       println("You must supply a repository name")
    //       return
    //     }
    //     tagName := c.Args()[1]
    //     if tagName == ""{
    //       println("You must supply a tag name")
    //       return
    //     }
    //     fmt.Printf("%v",listManifestsForRepository(c, repoName, tagName))
    //   },
    // },
  }

  app.Run(os.Args)
}

func listRepositories(c *cli.Context) string {
  body, err, resp := callApi(c, "/v2/_catalog", "GET")

  if err != nil{
    log.Fatal(err)
  }

  if resp.Status == "200" {
    // OK
  }
  return string(body)
}

func listTagsForRepository(c *cli.Context, repoName string) string{
  body, err, resp := callApi(c, fmt.Sprint("/v2/",repoName,"/tags/list"), "GET")

  if err != nil{
    log.Fatal(err)
  }

  if resp.Status == "200" {
    // OK
  }
  return string(body)
}

func listManifestsForRepository(c *cli.Context, repoName string, tagName string) (string, []string){
  // Call API
  body, err, resp := callApi(c, fmt.Sprint("/v2/",repoName,"/manifests/",tagName), "GET")

  // Unmarshal JSON into layers
  var m interface{} //Manifest
  jsonErr := json.Unmarshal(body, &m)
  temp := m.(map[string]interface{})

  if err != nil{
    log.Fatal(err)
  } else if jsonErr != nil{
    log.Fatal(jsonErr)
  }

  if resp.Status == "200" {
    // OK
  }

  var layerDigests []string

  for k, v := range temp {
    if k == "fsLayers" {
      layers := v.([]interface{})
      for a, b := range layers {
        if a == 0 {
          // ignoring
        }
        layer := b.(map[string]interface{})
        for c, d := range layer {
          if c == "blobSum" {
            layerDigests = append(layerDigests,d.(string))
          }
        }
      }
    }
  }
  digest := resp.Header.Get("Docker-Content-Digest")
  return digest, layerDigests
}

func deleteRepository(c *cli.Context, repoName string, tagName string) string{
  digest, layers := listManifestsForRepository(c, repoName, tagName)

  for k, v := range layers {
    if k == 0 {
      // Ignore
    }
    // Delete blobs
    body, err, resp := callApi(c, fmt.Sprint("/v2/",repoName,"/blobs/",v), "DELETE")
    if resp.Status == "200" {
      // OK
    }
    if err != nil{
      log.Fatal(err)
    } else {
      fmt.Println("Deleted blob:",v)
    }

    if body == nil {
      // ignore
    }
  }

  // Delete Manifest
  body, err, resp := callApi(c, fmt.Sprint("/v2/",repoName,"/manifests/",digest), "DELETE")
  if err != nil{
    log.Fatal(err)
  }
  if body == nil {
    // ignore
  }
  if resp.StatusCode == 202 {
    fmt.Println("Deleted manifest:",digest)
  } else {
    fmt.Println("Failed to delete manifest:",digest,"Status Code:",resp.StatusCode,"Response:",string(body))
  }

  return "done"
}

func callApi(c *cli.Context, path string, method string) ([]byte, error, http.Response){
  // Get HTTP Client
  client := &http.Client{}

  // Build up URL
  scheme := c.String("s")
  domain := c.String("d")
  port   := c.String("p")
  url := fmt.Sprint(scheme,"://",domain,":",port,path)
  fmt.Println("Calling API:",method,url)

  // Create Request object
  req, err := http.NewRequest(strings.ToUpper(method),url, nil)

  // Attach Auth Info
  user := c.String("u")
  pass := c.String("x")
  req.SetBasicAuth(user,pass)

  // Make API call
  resp, err := client.Do(req)
  defer resp.Body.Close()

  // Get API response body
  body, err := ioutil.ReadAll(resp.Body)

  return body, err, *resp
}
