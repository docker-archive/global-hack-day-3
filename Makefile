extract:
	docker cp vagrant_vcf_1:/tmp/maintenance/ sessions/

start_record_session.sh: __init_instrumentation.sh __exec_template_prefix __exec_template_suffix
	./make.sh
	chmod u+x start_record_session.sh
