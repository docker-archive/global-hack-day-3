package config_parser

// package main

import (
	"bytes"
	"crypto/md5"
	"fmt"
	"io/ioutil"
	"log"
	"os/exec"
	"regexp"
	"strconv"
	"strings"
)

type Server struct {
	Name string
	Tag  string
}

func Get_distro_name() string {
	distro_name_cmd := exec.Command("sh", "-c", "grep -i \"^NAME\" /etc/os-release | sed -e 's/NAME=//' -e 's/^\"//'  -e 's/\"$//' | tr '[:upper:]' '[:lower:]'")
	distro_name_out, err := distro_name_cmd.Output()
	if err != nil {
		return "other"
	}
	distro_name := strings.TrimRight(string(distro_name_out), "\n")
	return distro_name
}

func Config_parser() (map[string]map[string]interface{}, Server, bool, []uint8, []string) {
	// func main() {
	object_feature := make(map[string]map[string]interface{})
	var check_config bool = false
	var check_md5 []uint8
	var server_name string
	var list_monitor []string
	var server Server
	var out bytes.Buffer
	cmd := exec.Command("hostname")
	cmd.Stdout = &out
	cmd.Run()
	server_name = out.String()
	server_name_2 := strings.Split(server_name, "\n")
	server.Name = server_name_2[0]
	file, err := ioutil.ReadFile("config.cnf")

	if err != nil {
		log.Fatal(err)
	}

	hash := md5.New()
	check_md5 = hash.Sum(file)

	data_file := string(file)

	//Get config information by hostname from config_file
	var re = regexp.MustCompile(server_name_2[0] + "-.*")
	data := re.FindAllString(data_file, -1)
	data_tmp := strings.Split(data[0], "-")
	if data_tmp[0] == server.Name {
		check_config = true
		server.Tag = data_tmp[1]
		for element := 2; element < len(data_tmp); element++ {
			data_parser := make(map[string]interface{})
			element_array := strings.Split(data_tmp[element], ":")
			check_value_list := strings.Split(element_array[1], ",")
			// Case custom format, email:tan.luong1989@gmail.com,x.lhtan@yahoo.com <-- has "," delimiter but not welknown format
			check_format := strings.Split(check_value_list[1], "=")
			if len(check_value_list) == 1 || len(check_format) == 1 {
				data_parser[element_array[0]] = element_array[1]
			} else {
				list_monitor = append(list_monitor, element_array[0])
				for count := 0; count < len(check_value_list); count++ {
					temp_value := strings.Split(check_value_list[count], "=")
					data_parser[temp_value[0]], err = strconv.Atoi(temp_value[1])
				}
			}
			object_feature[element_array[0]] = data_parser
		}
		fmt.Println(object_feature)
	}
	return object_feature, server, check_config, check_md5, list_monitor
}
