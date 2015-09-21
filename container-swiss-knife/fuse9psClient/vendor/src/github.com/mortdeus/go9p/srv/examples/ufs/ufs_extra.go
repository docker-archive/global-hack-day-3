// Copyright 2009 The go9p Authors.  All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

// +build httpstats

package main

import (
	"github.com/mortdeus/go9p/srv"
)

func extraFuncs() {
	srv.StartStatsServer()
}
