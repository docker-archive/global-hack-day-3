package data_report

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
)

const (
	influxdb_server string = "127.0.0.1"
	influxdb_port   string = "8086"
	db_name         string = "suker"
	db_user         string = "suker"
	db_pass         string = "suker"
)

func Influxdb_report(influxdb_data string) {
	POST_DATA := influxdb_data
	uri_path := "http://" + influxdb_server + ":" + influxdb_port + "/write?db=" + db_name + "&u=" + db_user + "&p=" + db_pass
	var query = []byte(POST_DATA)
	req, err := http.NewRequest("POST", uri_path, bytes.NewBuffer(query))
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(req)
	client := &http.Client{}
	resp, err := client.Do(req)
	body, _ := ioutil.ReadAll(resp.Body)
	fmt.Println("response Body:", string(body))
}
