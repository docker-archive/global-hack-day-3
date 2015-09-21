include .version
include .env

compile:
	CGO_ENABLED=0 GOOS=linux godep go build -a -installsuffix cgo -o main .
install: compile
	mv main $(GOPATH)/bin/test-runner
bintray: compile
	curl -T main -uflower-pot:$(BINTRAY_API_KEY) https://api.bintray.com/content/emerald-ci/test-runner/binary/$(TEST_RUNNER_VERSION)/test-runner_linux-amd64
