package data_parser

import (
	//"fmt"
	"github.com/suker200/minimonitor/config_parser"
	"github.com/suker200/minimonitor/data_report"
	"log"
	"os/exec"
)

func Httpd(os string, function string, object_config map[string]map[string]interface{}, object_tag config_parser.Server, messages chan string) {

	out, err := exec.Command("bash", "-c", "cat `whereis apache2`/logs/access_log | wc -l").Output()

	if err != nil {
		log.Fatal(err)
	}

	access_log := string(out[:])
	httpd := "httpd" + "," + object_tag.Tag + "," + "type=httpd" + " value=" + access_log
	data_report.Pushbullet_report(function, object_config, "httpd", access_log)

	messages <- httpd
}
