package data_parser

import (
	"fmt"
	"github.com/suker200/minimonitor/config_parser"
	"github.com/suker200/minimonitor/data_report"
	"log"
	"os/exec"
)

func Ccu(os string, function string, object_config map[string]map[string]interface{}, object_tag config_parser.Server, messages chan string) {
	var data = make(map[string][]byte)
	var return_value string
	// var notification string
	data["centos"] = []byte("/usr/sbin/ss -a | grep -v '*\\|127.0.0.1\\|Address' | sed -e '/^$/d'  | wc -l")
	data["ubuntu"] = []byte("/usr/sbin/ss -a | grep -v '*\\|127.0.0.1\\|Address' | sed -e '/^$/d'  | wc -l")
	data["fedora"] = []byte("/usr/sbin/ss -a | grep -v '*\\|127.0.0.1\\|Address' | sed -e '/^$/d'  | wc -l")

	cmd := string(data[os][:])
	out, err := exec.Command("bash", "-c", cmd).Output()
	result := string(out[:])
	if err == nil {
		fmt.Println(result)
		return_value = "ccu" + "," + object_tag.Tag + " value=" + result
	} else {
		log.Fatal(err)
	}

	data_report.Pushbullet_report(function, object_config, "CCU", result)

	messages <- return_value
}
