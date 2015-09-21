// Copyright 2009 The Go9p Authors.  All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package srv

import "fmt"
import "github.com/mortdeus/go9p"

// Respond to the request with Rerror message
func (req *Req) RespondError(err interface{}) {
	switch e := err.(type) {
	case *go9p.Error:
		go9p.PackRerror(req.Rc, e.Error(), uint32(e.Errornum), req.Conn.Dotu)
	case error:
		go9p.PackRerror(req.Rc, e.Error(), uint32(go9p.EIO), req.Conn.Dotu)
	default:
		go9p.PackRerror(req.Rc, fmt.Sprintf("%v", e), uint32(go9p.EIO), req.Conn.Dotu)
	}

	req.Respond()
}

// Respond to the request with Rversion message
func (req *Req) RespondRversion(msize uint32, version string) {
	err := go9p.PackRversion(req.Rc, msize, version)
	if err != nil {
		req.RespondError(err)
	} else {
		req.Respond()
	}
}

// Respond to the request with Rauth message
func (req *Req) RespondRauth(aqid *go9p.Qid) {
	err := go9p.PackRauth(req.Rc, aqid)
	if err != nil {
		req.RespondError(err)
	} else {
		req.Respond()
	}
}

// Respond to the request with Rflush message
func (req *Req) RespondRflush() {
	err := go9p.PackRflush(req.Rc)
	if err != nil {
		req.RespondError(err)
	} else {
		req.Respond()
	}
}

// Respond to the request with Rattach message
func (req *Req) RespondRattach(aqid *go9p.Qid) {
	err := go9p.PackRattach(req.Rc, aqid)
	if err != nil {
		req.RespondError(err)
	} else {
		req.Respond()
	}
}

// Respond to the request with Rwalk message
func (req *Req) RespondRwalk(wqids []go9p.Qid) {
	err := go9p.PackRwalk(req.Rc, wqids)
	if err != nil {
		req.RespondError(err)
	} else {
		req.Respond()
	}
}

// Respond to the request with Ropen message
func (req *Req) RespondRopen(qid *go9p.Qid, iounit uint32) {
	err := go9p.PackRopen(req.Rc, qid, iounit)
	if err != nil {
		req.RespondError(err)
	} else {
		req.Respond()
	}
}

// Respond to the request with Rcreate message
func (req *Req) RespondRcreate(qid *go9p.Qid, iounit uint32) {
	err := go9p.PackRcreate(req.Rc, qid, iounit)
	if err != nil {
		req.RespondError(err)
	} else {
		req.Respond()
	}
}

// Respond to the request with Rread message
func (req *Req) RespondRread(data []byte) {
	err := go9p.PackRread(req.Rc, data)
	if err != nil {
		req.RespondError(err)
	} else {
		req.Respond()
	}
}

// Respond to the request with Rwrite message
func (req *Req) RespondRwrite(count uint32) {
	err := go9p.PackRwrite(req.Rc, count)
	if err != nil {
		req.RespondError(err)
	} else {
		req.Respond()
	}
}

// Respond to the request with Rclunk message
func (req *Req) RespondRclunk() {
	err := go9p.PackRclunk(req.Rc)
	if err != nil {
		req.RespondError(err)
	} else {
		req.Respond()
	}
}

// Respond to the request with Rremove message
func (req *Req) RespondRremove() {
	err := go9p.PackRremove(req.Rc)
	if err != nil {
		req.RespondError(err)
	} else {
		req.Respond()
	}
}

// Respond to the request with Rstat message
func (req *Req) RespondRstat(st *go9p.Dir) {
	err := go9p.PackRstat(req.Rc, st, req.Conn.Dotu)
	if err != nil {
		req.RespondError(err)
	} else {
		req.Respond()
	}
}

// Respond to the request with Rwstat message
func (req *Req) RespondRwstat() {
	err := go9p.PackRwstat(req.Rc)
	if err != nil {
		req.RespondError(err)
	} else {
		req.Respond()
	}
}
