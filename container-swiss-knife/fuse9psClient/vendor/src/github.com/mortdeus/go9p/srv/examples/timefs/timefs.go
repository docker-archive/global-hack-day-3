// Copyright 2009 The Go9p Authors.  All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import (
	"github.com/mortdeus/go9p"
	"github.com/mortdeus/go9p/srv"
	"flag"
	"fmt"
	"log"
	"os"
	"time"
)

type Time struct {
	srv.File
}
type InfTime struct {
	srv.File
}

var addr = flag.String("addr", ":5640", "network address")
var debug = flag.Bool("d", false, "print debug messages")
var debugall = flag.Bool("D", false, "print packets as well as debug messages")

func (*InfTime) Read(fid *srv.FFid, buf []byte, offset uint64) (int, error) {
	// push out time ignoring offset (infinite read)
	t := time.Now().String() + "\n"
	b := []byte(t)
	ml := len(b)
	if ml > len(buf) {
		ml = len(buf)
	}

	copy(buf, b[0:ml])
	return ml, nil
}

func (*Time) Read(fid *srv.FFid, buf []byte, offset uint64) (int, error) {
	b := []byte(time.Now().String())
	have := len(b)
	off := int(offset)

	if off >= have {
		return 0, nil
	}

	return copy(buf, b[off:]), nil
}

func main() {
	var err error
	var tm *Time
	var ntm *InfTime
	var s *srv.Fsrv

	flag.Parse()
	user := go9p.OsUsers.Uid2User(os.Geteuid())
	root := new(srv.File)
	err = root.Add(nil, "/", user, nil, go9p.DMDIR|0555, nil)
	if err != nil {
		goto error
	}

	tm = new(Time)
	err = tm.Add(root, "time", go9p.OsUsers.Uid2User(os.Geteuid()), nil, 0444, tm)
	if err != nil {
		goto error
	}
	ntm = new(InfTime)
	err = ntm.Add(root, "inftime", go9p.OsUsers.Uid2User(os.Geteuid()), nil, 0444, ntm)
	if err != nil {
		goto error
	}

	s = srv.NewFileSrv(root)
	s.Dotu = true

	if *debug {
		s.Debuglevel = 1
	}
	if *debugall {
		s.Debuglevel = 2
	}

	s.Start(s)
	err = s.StartNetListener("tcp", *addr)
	if err != nil {
		goto error
	}

	return

error:
	log.Println(fmt.Sprintf("Error: %s", err))
}
