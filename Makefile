any: docker-record.sh
	./docker-record.sh vagrant_vcf_1

extract:
	docker cp vagrant_vcf_1:/tmp/maintenance/ sessions/

docker-record.sh: __init_instrumentation.sh __exec_template_prefix __exec_template_suffix
	./make.sh
	chmod u+x docker-record.sh
