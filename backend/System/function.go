package main

import (
	"bytes"
	"encoding/json"
	"io"
	"log"
	"net/http"
)

func check_err(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

func sendPostRequest(url string, payload interface{}) (map[string]bool, error) {
    jsonPayload, err := json.Marshal(payload)
    check_err(err)

    req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonPayload))
    check_err(err)
    
    req.Header.Set("Content-Type", "application/json")

    client := &http.Client{}
    resp, err := client.Do(req)
    check_err(err)
    
    defer resp.Body.Close()

    body, err := io.ReadAll(resp.Body)
    check_err(err)

    var responseData map[string]bool
    err = json.Unmarshal(body, &responseData)
    check_err(err)

    return responseData, nil
}

func login_account(username string, email string, password string) bool {
    payload := map[string]string{
        "username": username,
        "email":    email,
        "password": password,
    }

    responseData, err := sendPostRequest("http://127.0.0.1:5050/login", payload)
    check_err(err)

    return responseData["success"]
}

func register_account(username string, email string, password string) bool {
    payload := map[string]string{
        "username": username,
        "email":    email,
        "password": password,
    }

    responseData, err := sendPostRequest("http://127.0.0.1:5050/register", payload)
    check_err(err)

    return responseData["success"]
}
