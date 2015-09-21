// Copyright 2009 The Go9p Authors.  All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package clnt

import "github.com/mortdeus/go9p"

// Clunks a fid. Returns nil if successful.
func (clnt *Clnt) Clunk(fid *Fid) (err error) {
	err = nil
	if fid.walked {
		tc := clnt.NewFcall()
		err := go9p.PackTclunk(tc, fid.Fid)
		if err != nil {
			return err
		}

		_, err = clnt.Rpc(tc)
	}

	clnt.fidpool.putId(fid.Fid)
	fid.walked = false
	fid.Fid = go9p.NOFID
	return
}

// Closes a file. Returns nil if successful.
func (file *File) Close() error {
	// Should we cancel all pending requests for the File
	return file.fid.Clnt.Clunk(file.fid)
}
