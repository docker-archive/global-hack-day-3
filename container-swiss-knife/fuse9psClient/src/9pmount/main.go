// A Go mirror of libfuse's hello.c

package main

import (
	"io"
	"io/ioutil"
	"log"
	"os"

	"github.com/hanwen/go-fuse/fuse"
	"github.com/hanwen/go-fuse/fuse/nodefs"
	"github.com/hanwen/go-fuse/fuse/pathfs"
	"github.com/mortdeus/go9p"
	"github.com/mortdeus/go9p/clnt"
	"github.com/tj/docopt"
)

type P9Fs struct {
	pathfs.FileSystem
}

var address string

func (me *P9Fs) GetAttr(name string, context *fuse.Context) (*fuse.Attr, fuse.Status) {
	switch name {
	case "file.txt":
		return &fuse.Attr{
			Mode: fuse.S_IFREG | 0644, Size: uint64(len(name)),
		}, fuse.OK
	case "":
		return &fuse.Attr{
			Mode: fuse.S_IFDIR | 0755,
		}, fuse.OK
	}
	return nil, fuse.ENOENT
}

func (me *P9Fs) OpenDir(name string, context *fuse.Context) (c []fuse.DirEntry, code fuse.Status) {
	if name == "" {
		c = []fuse.DirEntry{{Name: "file.txt", Mode: fuse.S_IFREG}}
		return c, fuse.OK
	}
	return nil, fuse.ENOENT
}

func (me *P9Fs) Open(name string, flags uint32, context *fuse.Context) (nodefs.File, fuse.Status) {

	var user go9p.User
	var err error
	var c *clnt.Clnt
	var file *clnt.File
	var f []byte

	user = go9p.OsUsers.Uid2User(os.Geteuid())
	clnt.DefaultDebuglevel = 0
	c, err = clnt.Mount("tcp", address, "", user)
	if err != nil {
		goto error
	}

	file, err = c.FOpen("/tmp/anaconda-post.log", go9p.OREAD)
	if err != nil {
		goto error
	}
	defer file.Close()
	f, err = ioutil.ReadAll(file)

	if err != nil && err != io.EOF {
		goto error
	}

	return nodefs.NewDataFile(f), fuse.OK

error:
	log.Println("Error", err)
	return nil, fuse.EPERM
}

func main() {
	usage := `9pmount

Usage:
  9pmount <mount_point> (--address <address>)

Options:
  -h --help                    Show this screen.
  --version                    Show version.
  --address                    Address of 9pserver`

	args, err := docopt.Parse(usage, nil, true, "9pmount 0.1", false)
	mount_point := args["<mount_point>"].(string)
	address = args["<address>"].(string)
	nfs := pathfs.NewPathNodeFs(&P9Fs{FileSystem: pathfs.NewDefaultFileSystem()}, nil)
	server, _, err := nodefs.MountRoot(mount_point, nfs.Root(), nil)
	if err != nil {
		log.Fatalf("Mount fail: %v\n", err)
	}
	server.Serve()
}
