image:
	docker build -t emeraldci/environment .
dev:
	cp $(GOPATH)/bin/test-runner ./test-runner
	docker build -f Dockerfile.dev -t emeraldci/environment .
run:
	docker run docker run --rm --privileged -v /var/run/docker.sock:/var/run/docker.sock -it emeraldci/environment https://github.com/emerald-ci/ruby-example
