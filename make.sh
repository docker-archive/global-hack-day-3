#!/bin/bash
cat __exec_template_prefix <(sed ':a;N;$!ba;s/\n//g' __init_instrumentation.sh) __exec_template_suffix | tr -d "\n" > start_record_session.sh
