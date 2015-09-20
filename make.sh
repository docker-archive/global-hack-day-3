#!/bin/bash
cat __exec_template_prefix <(sed ':a;N;$!ba;s/\n//g' __instrument) __exec_template_suffix | tr -d "\n" > session.sh
