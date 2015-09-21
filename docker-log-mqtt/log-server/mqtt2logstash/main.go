package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"git.eclipse.org/gitroot/paho/org.eclipse.paho.mqtt.golang.git"
	"net"
	"os"
	"strings"
	"time"
)

var mqttAddress string
var logstashAddress string
var mqttTopicFilter string

func init() {
	flag.Parse()
	args := flag.Args()
	if len(args) != 3 {
		fmt.Println("Usage: ./mqtt-to-logstash mqtt-address mqtt-topic-filter logstash-address")
		os.Exit(0)
	}
	mqttAddress = args[0]
	mqttTopicFilter = args[1]
	logstashAddress = args[2]
}

func main() {

	addr, err := net.ResolveTCPAddr("tcp", logstashAddress)
	if err != nil {
		panic(err)
	}

	conn, err := net.DialTCP("tcp", nil, addr)
	if err != nil {
		panic(err)
	}

	opts := mqtt.NewClientOptions().AddBroker("tcp://" + mqttAddress)
	opts.SetClientID("mqtt-to-logstash")
	opts.SetKeepAlive(60 * time.Second)

	opts.SetDefaultPublishHandler(func(client *mqtt.Client, msg mqtt.Message) {

		var message map[string]interface{}
		err := json.Unmarshal(msg.Payload(), &message)
		if err != nil {
			fmt.Printf("Failed to unmarshal %s: %s\n", msg.Payload(), err)
			return
		}

		topic := msg.Topic()
		levels := strings.Split(string(topic), "/")
		message["container_id"] = levels[len(levels)-1]
		messageBytes, err := json.Marshal(message)
		if err != nil {
			fmt.Printf("Failed to marshal %s: %s\n", message, err)
			return
		}
		//fmt.Println(string(messageBytes))
		conn.Write(messageBytes)
	})

	c := mqtt.NewClient(opts)
	if token := c.Connect(); token.Wait() && token.Error() != nil {
		panic(token.Error())
	}

	if token := c.Subscribe(mqttTopicFilter, 0, nil); token.Wait() && token.Error() != nil {
		fmt.Println(token.Error())
		os.Exit(1)
	}

	for {
		time.Sleep(1 * time.Hour)
	}
}
