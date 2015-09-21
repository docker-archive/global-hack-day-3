// Copyright 2009 The go9p Authors.  All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import (
	"flag"
	"fmt"
	"github.com/mortdeus/go9p"
	"github.com/mortdeus/go9p/srv"
	"io"
	"log"
	"os"
	"os/user"
	"strconv"
	"strings"
	"syscall"
	"time"
)

type Fid struct {
	path      string
	file      *os.File
	dirs      []os.FileInfo
	diroffset uint64
	st        os.FileInfo
}

type Ufs struct {
	srv.Srv
}

var addr = flag.String("addr", ":5640", "network address")
var debug = flag.Int("d", 0, "print debug messages")
var root = flag.String("root", "/", "root filesystem")
var Enoent = &go9p.Error{"file not found", go9p.ENOENT}

func toError(err error) *go9p.Error {
	var ecode syscall.Errno

	ename := err.Error()
	if e, ok := err.(syscall.Errno); ok {
		ecode = e
	} else {
		ecode = go9p.EIO
	}

	return &go9p.Error{ename, ecode}
}

// IsBlock reports if the file is a block device
func isBlock(d os.FileInfo) bool {
	stat := d.Sys().(*syscall.Stat_t)
	return (stat.Mode & syscall.S_IFMT) == syscall.S_IFBLK
}

// IsChar reports if the file is a character device
func isChar(d os.FileInfo) bool {
	stat := d.Sys().(*syscall.Stat_t)
	return (stat.Mode & syscall.S_IFMT) == syscall.S_IFCHR
}

func (fid *Fid) stat() *go9p.Error {
	var err error

	fid.st, err = os.Lstat(fid.path)
	if err != nil {
		return toError(err)
	}

	return nil
}

func omode2uflags(mode uint8) int {
	ret := int(0)
	switch mode & 3 {
	case go9p.OREAD:
		ret = os.O_RDONLY
		break

	case go9p.ORDWR:
		ret = os.O_RDWR
		break

	case go9p.OWRITE:
		ret = os.O_WRONLY
		break

	case go9p.OEXEC:
		ret = os.O_RDONLY
		break
	}

	if mode&go9p.OTRUNC != 0 {
		ret |= os.O_TRUNC
	}

	return ret
}

func dir2Qid(d os.FileInfo) *go9p.Qid {
	var qid go9p.Qid

	qid.Path = d.Sys().(*syscall.Stat_t).Ino
	qid.Version = uint32(d.ModTime().UnixNano() / 1000000)
	qid.Type = dir2QidType(d)

	return &qid
}

func dir2QidType(d os.FileInfo) uint8 {
	ret := uint8(0)
	if d.IsDir() {
		ret |= go9p.QTDIR
	}

	if d.Mode()&os.ModeSymlink != 0 {
		ret |= go9p.QTSYMLINK
	}

	return ret
}

func dir2Npmode(d os.FileInfo, dotu bool) uint32 {
	ret := uint32(d.Mode() & 0777)
	if d.IsDir() {
		ret |= go9p.DMDIR
	}

	if dotu {
		mode := d.Mode()
		if mode&os.ModeSymlink != 0 {
			ret |= go9p.DMSYMLINK
		}

		if mode&os.ModeSocket != 0 {
			ret |= go9p.DMSOCKET
		}

		if mode&os.ModeNamedPipe != 0 {
			ret |= go9p.DMNAMEDPIPE
		}

		if mode&os.ModeDevice != 0 {
			ret |= go9p.DMDEVICE
		}

		if mode&os.ModeSetuid != 0 {
			ret |= go9p.DMSETUID
		}

		if mode&os.ModeSetgid != 0 {
			ret |= go9p.DMSETGID
		}
	}

	return ret
}

// Dir is an instantiation of the go9p.Dir structure
// that can act as a receiver for local methods.
type Dir struct {
	go9p.Dir
}

func dir2Dir(path string, d os.FileInfo, dotu bool, upool go9p.Users) *go9p.Dir {
	sysMode := d.Sys().(*syscall.Stat_t)

	dir := new(Dir)
	dir.Qid = *dir2Qid(d)
	dir.Mode = dir2Npmode(d, dotu)
	dir.Atime = uint32(atime(sysMode).Unix())
	dir.Mtime = uint32(d.ModTime().Unix())
	dir.Length = uint64(d.Size())
	dir.Name = path[strings.LastIndex(path, "/")+1:]

	if dotu {
		dir.dotu(path, d, upool, sysMode)
		return &dir.Dir
	}

	unixUid := int(sysMode.Uid)
	unixGid := int(sysMode.Gid)
	dir.Uid = strconv.Itoa(unixUid)
	dir.Gid = strconv.Itoa(unixGid)
	dir.Muid = "none"

	// BUG(akumar): LookupId will never find names for
	// groups, as it only operates on user ids.
	u, err := user.LookupId(dir.Uid)
	if err == nil {
		dir.Uid = u.Username
	}
	g, err := user.LookupId(dir.Gid)
	if err == nil {
		dir.Gid = g.Username
	}

	return &dir.Dir
}

func (dir *Dir) dotu(path string, d os.FileInfo, upool go9p.Users, sysMode *syscall.Stat_t) {
	u := upool.Uid2User(int(sysMode.Uid))
	g := upool.Gid2Group(int(sysMode.Gid))
	dir.Uid = u.Name()
	if dir.Uid == "" {
		dir.Uid = "none"
	}

	dir.Gid = g.Name()
	if dir.Gid == "" {
		dir.Gid = "none"
	}
	dir.Muid = "none"
	dir.Ext = ""
	dir.Uidnum = uint32(u.Id())
	dir.Gidnum = uint32(g.Id())
	dir.Muidnum = go9p.NOUID
	if d.Mode()&os.ModeSymlink != 0 {
		var err error
		dir.Ext, err = os.Readlink(path)
		if err != nil {
			dir.Ext = ""
		}
	} else if isBlock(d) {
		dir.Ext = fmt.Sprintf("b %d %d", sysMode.Rdev>>24, sysMode.Rdev&0xFFFFFF)
	} else if isChar(d) {
		dir.Ext = fmt.Sprintf("c %d %d", sysMode.Rdev>>24, sysMode.Rdev&0xFFFFFF)
	}
}

func (*Ufs) ConnOpened(conn *srv.Conn) {
	if conn.Srv.Debuglevel > 0 {
		log.Println("connected")
	}
}

func (*Ufs) ConnClosed(conn *srv.Conn) {
	if conn.Srv.Debuglevel > 0 {
		log.Println("disconnected")
	}
}

func (*Ufs) FidDestroy(sfid *srv.Fid) {
	var fid *Fid

	if sfid.Aux == nil {
		return
	}

	fid = sfid.Aux.(*Fid)
	if fid.file != nil {
		fid.file.Close()
	}
}

func (*Ufs) Attach(req *srv.Req) {
	if req.Afid != nil {
		req.RespondError(srv.Enoauth)
		return
	}

	tc := req.Tc
	fid := new(Fid)
	if len(tc.Aname) == 0 {
		fid.path = *root
	} else {
		fid.path = tc.Aname
	}

	req.Fid.Aux = fid
	err := fid.stat()
	if err != nil {
		req.RespondError(err)
		return
	}

	qid := dir2Qid(fid.st)
	req.RespondRattach(qid)
}

func (*Ufs) Flush(req *srv.Req) {}

func (*Ufs) Walk(req *srv.Req) {
	fid := req.Fid.Aux.(*Fid)
	tc := req.Tc

	err := fid.stat()
	if err != nil {
		req.RespondError(err)
		return
	}

	if req.Newfid.Aux == nil {
		req.Newfid.Aux = new(Fid)
	}

	nfid := req.Newfid.Aux.(*Fid)
	wqids := make([]go9p.Qid, len(tc.Wname))
	path := fid.path
	i := 0
	for ; i < len(tc.Wname); i++ {
		p := path + "/" + tc.Wname[i]
		st, err := os.Lstat(p)
		if err != nil {
			if i == 0 {
				req.RespondError(Enoent)
				return
			}

			break
		}

		wqids[i] = *dir2Qid(st)
		path = p
	}

	nfid.path = path
	req.RespondRwalk(wqids[0:i])
}

func (*Ufs) Open(req *srv.Req) {
	fid := req.Fid.Aux.(*Fid)
	tc := req.Tc
	err := fid.stat()
	if err != nil {
		req.RespondError(err)
		return
	}

	var e error
	fid.file, e = os.OpenFile(fid.path, omode2uflags(tc.Mode), 0)
	if e != nil {
		req.RespondError(toError(e))
		return
	}

	req.RespondRopen(dir2Qid(fid.st), 0)
}

func (*Ufs) Create(req *srv.Req) {
	fid := req.Fid.Aux.(*Fid)
	tc := req.Tc
	err := fid.stat()
	if err != nil {
		req.RespondError(err)
		return
	}

	path := fid.path + "/" + tc.Name
	var e error = nil
	var file *os.File = nil
	switch {
	case tc.Perm&go9p.DMDIR != 0:
		e = os.Mkdir(path, os.FileMode(tc.Perm&0777))

	case tc.Perm&go9p.DMSYMLINK != 0:
		e = os.Symlink(tc.Ext, path)

	case tc.Perm&go9p.DMLINK != 0:
		n, e := strconv.ParseUint(tc.Ext, 10, 0)
		if e != nil {
			break
		}

		ofid := req.Conn.FidGet(uint32(n))
		if ofid == nil {
			req.RespondError(srv.Eunknownfid)
			return
		}

		e = os.Link(ofid.Aux.(*Fid).path, path)
		ofid.DecRef()

	case tc.Perm&go9p.DMNAMEDPIPE != 0:
	case tc.Perm&go9p.DMDEVICE != 0:
		req.RespondError(&go9p.Error{"not implemented", go9p.EIO})
		return

	default:
		var mode uint32 = tc.Perm & 0777
		if req.Conn.Dotu {
			if tc.Perm&go9p.DMSETUID > 0 {
				mode |= syscall.S_ISUID
			}
			if tc.Perm&go9p.DMSETGID > 0 {
				mode |= syscall.S_ISGID
			}
		}
		file, e = os.OpenFile(path, omode2uflags(tc.Mode)|os.O_CREATE, os.FileMode(mode))
	}

	if file == nil && e == nil {
		file, e = os.OpenFile(path, omode2uflags(tc.Mode), 0)
	}

	if e != nil {
		req.RespondError(toError(e))
		return
	}

	fid.path = path
	fid.file = file
	err = fid.stat()
	if err != nil {
		req.RespondError(err)
		return
	}

	req.RespondRcreate(dir2Qid(fid.st), 0)
}

func (*Ufs) Read(req *srv.Req) {
	fid := req.Fid.Aux.(*Fid)
	tc := req.Tc
	rc := req.Rc
	err := fid.stat()
	if err != nil {
		req.RespondError(err)
		return
	}

	go9p.InitRread(rc, tc.Count)
	var count int
	var e error
	if fid.st.IsDir() {
		b := rc.Data
		if tc.Offset == 0 {
			fid.file.Close()
			fid.file, e = os.OpenFile(fid.path, omode2uflags(req.Fid.Omode), 0)
			if e != nil {
				req.RespondError(toError(e))
				return
			}
		}

		for len(b) > 0 {
			if fid.dirs == nil {
				fid.dirs, e = fid.file.Readdir(16)
				if e != nil && e != io.EOF {
					req.RespondError(toError(e))
					return
				}

				if len(fid.dirs) == 0 {
					break
				}
			}

			var i int
			for i = 0; i < len(fid.dirs); i++ {
				path := fid.path + "/" + fid.dirs[i].Name()
				st := dir2Dir(path, fid.dirs[i], req.Conn.Dotu, req.Conn.Srv.Upool)
				sz := go9p.PackDir(st, b, req.Conn.Dotu)
				if sz == 0 {
					break
				}

				b = b[sz:]
				count += sz
			}

			if i < len(fid.dirs) {
				fid.dirs = fid.dirs[i:]
				break
			} else {
				fid.dirs = nil
			}
		}
	} else {
		count, e = fid.file.ReadAt(rc.Data, int64(tc.Offset))
		if e != nil && e != io.EOF {
			req.RespondError(toError(e))
			return
		}
	}

	go9p.SetRreadCount(rc, uint32(count))
	req.Respond()
}

func (*Ufs) Write(req *srv.Req) {
	fid := req.Fid.Aux.(*Fid)
	tc := req.Tc
	err := fid.stat()
	if err != nil {
		req.RespondError(err)
		return
	}

	n, e := fid.file.WriteAt(tc.Data, int64(tc.Offset))
	if e != nil {
		req.RespondError(toError(e))
		return
	}

	req.RespondRwrite(uint32(n))
}

func (*Ufs) Clunk(req *srv.Req) { req.RespondRclunk() }

func (*Ufs) Remove(req *srv.Req) {
	fid := req.Fid.Aux.(*Fid)
	err := fid.stat()
	if err != nil {
		req.RespondError(err)
		return
	}

	e := os.Remove(fid.path)
	if e != nil {
		req.RespondError(toError(e))
		return
	}

	req.RespondRremove()
}

func (*Ufs) Stat(req *srv.Req) {
	fid := req.Fid.Aux.(*Fid)
	err := fid.stat()
	if err != nil {
		req.RespondError(err)
		return
	}

	st := dir2Dir(fid.path, fid.st, req.Conn.Dotu, req.Conn.Srv.Upool)
	req.RespondRstat(st)
}

func lookup(uid string, group bool) (uint32, *go9p.Error) {
	if uid == "" {
		return go9p.NOUID, nil
	}
	usr, e := user.Lookup(uid)
	if e != nil {
		return go9p.NOUID, toError(e)
	}
	conv := usr.Uid
	if group {
		conv = usr.Gid
	}
	u, e := strconv.Atoi(conv)
	if e != nil {
		return go9p.NOUID, toError(e)
	}
	return uint32(u), nil
}

func (*Ufs) Wstat(req *srv.Req) {
	fid := req.Fid.Aux.(*Fid)
	err := fid.stat()
	if err != nil {
		req.RespondError(err)
		return
	}

	dir := &req.Tc.Dir
	if dir.Mode != 0xFFFFFFFF {
		mode := dir.Mode & 0777
		if req.Conn.Dotu {
			if dir.Mode&go9p.DMSETUID > 0 {
				mode |= syscall.S_ISUID
			}
			if dir.Mode&go9p.DMSETGID > 0 {
				mode |= syscall.S_ISGID
			}
		}
		e := os.Chmod(fid.path, os.FileMode(mode))
		if e != nil {
			req.RespondError(toError(e))
			return
		}
	}

	uid, gid := go9p.NOUID, go9p.NOUID
	if req.Conn.Dotu {
		uid = dir.Uidnum
		gid = dir.Gidnum
	}

	// Try to find local uid, gid by name.
	if (dir.Uid != "" || dir.Gid != "") && !req.Conn.Dotu {
		uid, err = lookup(dir.Uid, false)
		if err != nil {
			req.RespondError(err)
			return
		}

		// BUG(akumar): Lookup will never find gids
		// corresponding to group names, because
		// it only operates on user names.
		gid, err = lookup(dir.Gid, true)
		if err != nil {
			req.RespondError(err)
			return
		}
	}

	if uid != go9p.NOUID || gid != go9p.NOUID {
		e := os.Chown(fid.path, int(uid), int(gid))
		if e != nil {
			req.RespondError(toError(e))
			return
		}
	}

	if dir.Name != "" {
		path := fid.path[0:strings.LastIndex(fid.path, "/")+1] + "/" + dir.Name
		err := syscall.Rename(fid.path, path)
		if err != nil {
			req.RespondError(toError(err))
			return
		}
		fid.path = path
	}

	if dir.Length != 0xFFFFFFFFFFFFFFFF {
		e := os.Truncate(fid.path, int64(dir.Length))
		if e != nil {
			req.RespondError(toError(e))
			return
		}
	}

	// If either mtime or atime need to be changed, then
	// we must change both.
	if dir.Mtime != ^uint32(0) || dir.Atime != ^uint32(0) {
		mt, at := time.Unix(int64(dir.Mtime), 0), time.Unix(int64(dir.Atime), 0)
		if cmt, cat := (dir.Mtime == ^uint32(0)), (dir.Atime == ^uint32(0)); cmt || cat {
			st, e := os.Stat(fid.path)
			if e != nil {
				req.RespondError(toError(e))
				return
			}
			switch cmt {
			case true:
				mt = st.ModTime()
			default:
				at = atime(st.Sys().(*syscall.Stat_t))
			}
		}
		e := os.Chtimes(fid.path, at, mt)
		if e != nil {
			req.RespondError(toError(e))
			return
		}
	}

	req.RespondRwstat()
}

func main() {
	flag.Parse()
	ufs := new(Ufs)
	ufs.Dotu = true
	ufs.Id = "ufs"
	ufs.Debuglevel = *debug
	ufs.Start(ufs)

	err := ufs.StartNetListener("tcp", *addr)
	if err != nil {
		log.Println(err)
	}
}
