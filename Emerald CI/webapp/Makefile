image:
	docker build -t emeraldci/webapp .
webhook:
	curl -i -X POST http://localhost:8080/api/v1/projects/1/builds/trigger/github -H "Content-Type: application/json" --data-binary @example_webhook_payload
