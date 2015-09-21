package main

import (
	"crypto/md5"
	"fmt"
	"github.com/suker200/minimonitor/config_parser"
	"github.com/suker200/minimonitor/data_parser"
	"github.com/suker200/minimonitor/data_report"
	"io/ioutil"
	"reflect"
	"time"
)

func main() {
	for {
		// First loop, I left parsing config file because avoid wasting resource for reading and looping for get
		// container config from config file
		object_config, object_tag, check, check_md5, list_monitor := config_parser.Config_parser()
		os := config_parser.Get_distro_name()
		// fmt.Print(check_md5)
		if check {
			map_function := map[string]interface{}{
				"memory":   data_parser.Memory,
				"ccu":      data_parser.Ccu,
				"loadavg":  data_parser.LoadAvg,
				"disk":     data_parser.Disk,
				"cpuusage": data_parser.GetCPUUsage,
			}

			fmt.Println(object_config)
			var counter int = 0
			// I use an mathematic for calculate which process should be execute base on time we set in config file
			// as ccu exec every 20sec, mem every 30sec.
			// I use jumper 5 second for limit loop speed wasting reousrce. So minimum time we exec is 5sec
			// If you want more, set this value lower
			// I will reset counter every day, because if it too big, it will wasting reousrce for % calculation.
			for {
				// detect file change and reload config
				file_check, err := ioutil.ReadFile("config.cnf")
				if err == nil {
					hash := md5.New()
					check_md5_check := hash.Sum(file_check)
					if !reflect.DeepEqual(check_md5_check, check_md5) {
						fmt.Println("File is changed! Re-Load new config")
						object_config, object_tag, check, check_md5, list_monitor = config_parser.Config_parser()
					}
				}
				// start process data
				messages := make(chan string, 2)
				var influxdb_data string
				// Decide send data to influxdb or not
				var send_check bool = false
				for i := range list_monitor {
					check := counter % object_config[list_monitor[i]]["time"].(int)
					if check == 0 {
						go map_function[list_monitor[i]].(func(os_name string, metric_name string, config map[string]map[string]interface{}, tag config_parser.Server, messages chan string))(os, list_monitor[i], object_config, object_tag, messages)
						// fmt.Println(<-messages)
						result := <-messages
						influxdb_data = influxdb_data + result
						send_check = true
					}
				}
				// Reset counter, if not, wasting reousrce for calculating
				counter += 5
				if counter > 86400 {
					counter = 0
				}
				// fmt.Println(send_check)
				fmt.Println(influxdb_data)
				if send_check {
					data_report.Influxdb_report(influxdb_data)
				}
				time.Sleep(5000 * time.Millisecond)
			}
		} else {
			fmt.Print("Failed to read config.conf file | Or does not have config information")
			time.Sleep(5000 * time.Millisecond)
		}
	}
}
