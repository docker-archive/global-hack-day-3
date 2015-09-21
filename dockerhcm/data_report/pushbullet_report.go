package data_report

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"regexp"
	"strconv"
	"strings"
)

func Pushbullet_report(function string, object_config map[string]map[string]interface{}, title_message string, result interface{}) {
	warning := object_config[function]["warning"].(int)
	critical := object_config[function]["critical"].(int)
	email := object_config["email"]["email"].(string)

	// convert result value to int
	var notification string
	var check bool
	var result_int int
	var result_string string
	var re = regexp.MustCompile(`[\n%a-zA-Z ]+`)

	switch result.(type) {
	case int8:
		result_string = strconv.Itoa(result.(int))
		result_int = result.(int)
	case int16:
		result_string = strconv.Itoa(result.(int))
		result_int = result.(int)
	case int32:
		result_string = strconv.Itoa(result.(int))
		result_int = result.(int)
	case int64:
		result_string = strconv.Itoa(result.(int))
		result_int = result.(int)
	case string:
		result_string = result.(string)
		result_int, _ = strconv.Atoi(re.ReplaceAllString(result.(string), ""))
	case float64:
		result_string = strconv.FormatFloat(result.(float64), 'f', -1, 64)
		result_int = int(result.(float64))
	case float32:
		result_string = strconv.FormatFloat(result.(float64), 'f', -1, 32)
		result_int = int(result.(float32))
	default:
		fmt.Println("unknown")
	}

	fmt.Println(title_message)
	fmt.Println(result_int)

	if result_int > critical {
		// critical case, send notification
		fmt.Println("critical")
		notification = "[CRITICAL] " + title_message + " " + strings.Replace(result_string, "\n", "", -1) + " greater than " + strconv.Itoa(critical)
		check = true
	} else if result_int > warning {
		fmt.Println("warning")
		// warning case, send notification
		notification = "[WARNING] " + title_message + " " + strings.Replace(result_string, "\n", "", -1) + " greater than " + strconv.Itoa(warning)
		check = true
	}

	if check {
		list_email := strings.Split(email, ",")
		for _, reciever := range list_email {
			uri_path := "https://api.pushbullet.com/v2/pushes"
			email_reciever := reciever
			message := "{'type': 'note', 'title':'" + title_message + "', 'body':'" + notification + "', 'email':'" + email_reciever + "'}"
			message_format := strings.Replace(message, "'", "\"", -1)
			req, err := http.NewRequest("POST", uri_path, bytes.NewBuffer([]byte(message_format)))
			req.Header.Set("Access-Token", "xxx")
			req.Header.Set("Content-Type", "application/json")
			if err != nil {
				log.Fatal(err)
			}

			client := &http.Client{}
			resp, err := client.Do(req)
			response, _ := ioutil.ReadAll(resp.Body)
			fmt.Println(string(response))
		}
	}
}
