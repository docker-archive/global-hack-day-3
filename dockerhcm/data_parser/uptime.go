package data_parser

import (
	"github.com/suker200/minimonitor/config_parser"
	"github.com/suker200/minimonitor/data_report"
	"io/ioutil"
	"log"
	"strings"
)

func Uptime(os string, function string, object_config map[string]map[string]interface{}, object_tag config_parser.Server, messages chan string) {
	f, err := ioutil.ReadFile("/proc/uptime")

	if err != nil {
		log.Fatal(err)
	}

	content := strings.TrimSpace(string(f))
	fields := strings.Fields(content)
	uptime_total := fields[0]
	uptime_idle := fields[1]

	data_report.Pushbullet_report(function, object_config, "Uptime", uptime_total)

	uptime := "uptime" + "," + object_tag.Tag + "," + "type=uptime_total" + " value=" + uptime_total
	uptime += "uptime" + "," + object_tag.Tag + "," + "type=uptime_idle" + " value=" + uptime_idle

	messages <- uptime
	//fmt.Println(uptime)
	//return uptime
}
