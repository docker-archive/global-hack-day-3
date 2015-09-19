SESSION_ID=`date +%s`; SESSION_ROOT=/tmp/maintenance/$SESSION_ID; mkdir -p $SESSION_ROOT; 
function __maintenance_mode() {
	echo $EUID >> $SESSION_ROOT/euid &&
	echo $BASH_COMMAND >> $SESSION_ROOT/cmd && 
	echo $PWD >> $SESSION_ROOT/pwd && 
	echo $(export | tr "\n" ";") >> $SESSION_ROOT/env || exit;
}; 
shopt -s extdebug; trap __maintenance_mode DEBUG;'
