# Set an output prefix, which is the local directory if not specified
PREFIX?=$(shell pwd)


# Used to populate version variable in main package.
VERSION=$(shell git describe --match 'v[0-9]*' --dirty='.m' --always)

# Allow turning off function inlining and variable registerization
ifeq (${DISABLE_OPTIMIZATION},true)
	GO_GCFLAGS=-gcflags "-N -l"
	VERSION:="$(VERSION)-noopt"
endif

GO_LDFLAGS=-ldflags "-X main.version $(VERSION)"

.PHONY: clean all fmt vet lint build test bin
.DEFAULT: default
all: AUTHORS clean fmt vet fmt lint build test bin

AUTHORS: .mailmap .git/HEAD
	 git log --format='%aN <%aE>' | sort -fu > $@

${PREFIX}/bin/godoauth: $(shell find . -type f -name '*.go')
	@echo "+ $@"
	@go build -tags "${DOCKER_BUILDTAGS}" -o $@ ${GO_LDFLAGS}  ${GO_GCFLAGS} ./cmd/godoauth

# Depends on binaries because vet will silently fail if it can't load compiled
# imports
vet: bin
	@echo "+ $@"
	@go vet ./...

fmt:
	@echo "+ $@"
	@test -z "$$(gofmt -s -l . | tee /dev/stderr)" || \
		echo "+ please format Go code with 'gofmt -s'"

lint:
	@echo "+ $@"
	@test -z "$$(golint ./... | tee /dev/stderr)"

dep:
	@echo "+ $@"
	go get -v ./...
build:
	@echo "+ $@"
	@go build -tags "${DOCKER_BUILDTAGS}" -v ${GO_LDFLAGS} ./...

test:
	@echo "+ $@"
	@go test ./...

bin: ${PREFIX}/bin/godoauth
	@echo "+ $@"

clean:
	@echo "+ $@"
	@rm -rf "${PREFIX}/bin/godoauth"
