// Copyright 2012 The go9p Authors.  All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import (
	"syscall"
	"time"
)

func atime(stat *syscall.Stat_t) time.Time {
	return time.Unix(stat.Atim.Unix())
}
