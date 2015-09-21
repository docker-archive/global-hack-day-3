VERSION=0.3

build:
	docker build -t sequenceiq/runc-bin .
	rm -rf build; mkdir -p build
	docker run sequenceiq/runc-bin cat /go/src/github.com/opencontainers/runc/runc-0.3.tgz > build/runc-0.3.tgz
	docker run sequenceiq/runc-bin cat /go/src/github.com/opencontainers/runc/runc > build/runc
	chmod +x build/runc

deps:
	go get -u github.com/jteeuwen/go-bindata/...
	go get github.com/progrium/gh-release

release: build
	rm -rf release; mkdir -p release
	docker run sequenceiq/runc-bin cat /go/src/github.com/opencontainers/runc/runc-0.3.tgz > release/runc-0.3.tgz
	docker run sequenceiq/runc-bin cat /go/src/github.com/opencontainers/runc/runc > release/runc
	chmod +x release/runc
	gh-release create sequenceiq/global-hack-day-3  0.3

bindata:
	go-bindata include .deps/bin


