package data_parser

import (
	"github.com/suker200/minimonitor/config_parser"
	"github.com/suker200/minimonitor/data_report"
	"io/ioutil"
	"log"
	"strconv"
	"strings"
	"time"
)

func Get_CPU_Sample() (idle, total uint64) {
	contents, err := ioutil.ReadFile("/proc/stat")
	if err != nil {
		log.Fatal(err)
		return
	}
	lines := strings.Split(string(contents), "\n")
	for _, line := range lines {
		fields := strings.Fields(line)
		if fields[0] == "cpu" {
			numFields := len(fields)
			for i := 1; i < numFields; i++ {
				val, err := strconv.ParseUint(fields[i], 10, 64)
				if err != nil {
					log.Fatal("Error: ", i, fields[i], err)
				}
				total += val // tally up all the numbers to get total ticks
				if i == 4 {  // idle is the 5th field in the cpu line
					idle = val
				}
			}
			return
		}
	}
	return
}

func GetCPUUsage(os string, function string, object_config map[string]map[string]interface{}, object_tag config_parser.Server, messages chan string) {
	idle0, total0 := Get_CPU_Sample()
	time.Sleep(1 * time.Second)
	idle1, total1 := Get_CPU_Sample()

	idleTicks := float64(idle1 - idle0)
	totalTicks := float64(total1 - total0)
	cpuUsage := 100 * (totalTicks - idleTicks) / totalTicks

	// data_report.Pushbullet_report(function, object_config, "CPUUsage", strconv.FormatFloat(cpuUsage, 'f', -1, 64))
	data_report.Pushbullet_report(function, object_config, "CPUUsage", cpuUsage)

	cpuUsage_msg := "cpuusage" + "," + object_tag.Tag + "," + "type=cpu_usage" + " value=" + strconv.FormatFloat(cpuUsage, 'f', -1, 64) + "\n"

	messages <- cpuUsage_msg
}
