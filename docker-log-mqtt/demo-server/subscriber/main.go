package main

import (
	//"encoding/json"
	"flag"
	"fmt"
	"git.eclipse.org/gitroot/paho/org.eclipse.paho.mqtt.golang.git"
	"math/rand"
	"os"
	//"strings"
	"time"
)

var mqttAddress string
var mqttTopicFilter string

func init() {
	fmt.Println("init...")

	flag.Parse()
	args := flag.Args()
	if len(args) != 2 {
		fmt.Println("Usage: app mqtt-address mqtt-topic-filter")
		os.Exit(0)
	}
	mqttAddress = args[0]
	mqttTopicFilter = args[1]

	time.Sleep(2 * time.Second)

}

const hexLetters = "0123456789abcdef"

func RandStringBytes(n int) string {
	b := make([]byte, n)
	for i := range b {
		b[i] = hexLetters[rand.Intn(len(hexLetters))]
	}
	return string(b)
}

func main() {

	fmt.Println("Connecting to mqtt...")
	opts := mqtt.NewClientOptions().AddBroker("tcp://" + mqttAddress)
	opts.SetClientID("subscriber" + RandStringBytes(16))
	opts.SetKeepAlive(60 * time.Second)

	opts.SetDefaultPublishHandler(func(client *mqtt.Client, msg mqtt.Message) {

		/*
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
			fmt.Println("Received log:", string(messageBytes))
		*/
		fmt.Println("Topic: ", string(msg.Topic()))
		fmt.Println("Log  : ", string(msg.Payload()))
	})

	c := mqtt.NewClient(opts)
	if token := c.Connect(); token.Wait() && token.Error() != nil {
		panic(token.Error())
	}

	fmt.Println("Subscribing", mqttTopicFilter)
	if token := c.Subscribe(mqttTopicFilter, 0, nil); token.Wait() && token.Error() != nil {
		fmt.Println(token.Error())
		os.Exit(1)
	}

	for {
		time.Sleep(1 * time.Hour)
	}
}
