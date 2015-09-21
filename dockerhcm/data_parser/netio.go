package data_parser

import (
	// "fmt"
	"github.com/suker200/minimonitor/config_parser"
	// "github.com/suker200/minimonitor/data_report"
	"io/ioutil"
	"log"
	"strings"
)

func NetIO(os string, object_config map[string]map[string]interface{}, object_tag config_parser.Server, messages chan string) {
	f, err := ioutil.ReadFile("/proc/net/dev")

	if err != nil {
		log.Fatal(err)
	}

	netio := ""
	lines := strings.Split(string(f), "\n")
	for _, line := range lines {
		if strings.Contains(line, ":") {
			content := strings.TrimSpace(line)
			fields := strings.Fields(content)

			dev := strings.Replace(fields[0], ":", "", -1)
			in := fields[1]
			out := fields[9]
			netio += "netio" + "," + object_tag.Tag + "," + "type=in" + " interface=" + dev + " value=" + in + "\n"
			netio += "netio" + "," + object_tag.Tag + "," + "type=out" + " interface=" + dev + " value=" + out + "\n"
		}
	}

	netio = strings.TrimPrefix(netio, "\n")

	messages <- netio
	//fmt.Println(netio)
	//return netio
}
