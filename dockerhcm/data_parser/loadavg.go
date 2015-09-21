package data_parser

import (
	"github.com/suker200/minimonitor/config_parser"
	"github.com/suker200/minimonitor/data_report"
	"io/ioutil"
	"log"
	"strings"
)

func LoadAvg(os string, function string, object_config map[string]map[string]interface{}, object_tag config_parser.Server, messages chan string) {
	f, err := ioutil.ReadFile("/proc/loadavg")

	if err != nil {
		log.Fatal(err)
	}

	content := strings.TrimSpace(string(f))
	fields := strings.Fields(content)

	loadavg1min := fields[0]
	loadavg5min := fields[1]
	loadavg15min := fields[2]

	// warning_threshold := object_config["loadavg"]["warning"].(int)
	// critical_threshold := object_config["loadavg"]["critical"].(int)
	data_report.Pushbullet_report(function, object_config, "LoadAvg1Min", loadavg1min)

	loadavg := "loadavg" + "," + object_tag.Tag + "," + "type=loadavg1min" + " value=" + loadavg1min + "\n"
	loadavg += "loadavg" + "," + object_tag.Tag + "," + "type=loadavg5min" + " value=" + loadavg5min + "\n"
	loadavg += "loadavg" + "," + object_tag.Tag + "," + "type=loadavg15min" + " value=" + loadavg15min + "\n"

	messages <- loadavg
}
