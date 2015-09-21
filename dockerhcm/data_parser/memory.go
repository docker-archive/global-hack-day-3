package data_parser

import (
	"github.com/suker200/minimonitor/config_parser"
	"github.com/suker200/minimonitor/data_report"
	"io/ioutil"
	"log"
	"regexp"
	"strconv"
	"strings"
)

func Memory(os string, function string, object_config map[string]map[string]interface{}, object_tag config_parser.Server, messages chan string) {
	var re = regexp.MustCompile(`[\n%a-zA-Z ]`)
	f, err := ioutil.ReadFile("/proc/meminfo")

	if err != nil {
		log.Fatal(err)
	}

	var str_memory_usage string
	lines := strings.Split(string(f), "\n")
	for _, line := range lines {
		fields := strings.SplitN(line, ":", 2)

		if fields[0] == "Active" {
			str_memory_usage = strings.TrimSpace(fields[1])
			str_memory_usage = strings.Replace(str_memory_usage, " kB", "", -1)
			int_memory_usage, _ := strconv.Atoi(str_memory_usage)
			int_memory_usage = int_memory_usage / 1024
			str_memory_usage = strconv.Itoa(int_memory_usage) + "MB"
		}
	}

	data_report.Pushbullet_report(function, object_config, "Memory", str_memory_usage)

	memory := "memory" + "," + object_tag.Tag + "," + "type=memory_usage" + " value=" + re.ReplaceAllString(str_memory_usage, "")

	messages <- memory
	//fmt.Println(memory)
	//return memory
}
