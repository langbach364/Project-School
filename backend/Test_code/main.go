package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

func testAPI(url string, payload map[string]string) {
	jsonPayload, _ := json.Marshal(payload)
	resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonPayload))
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}
	defer resp.Body.Close()

	var result map[string]bool
	json.NewDecoder(resp.Body).Decode(&result)
	fmt.Printf("API: %s, Result: %v\n", url, result)
}


func main() {
	loginPayload := map[string]string{
		"username": "testuser",
		"email":    "test@example.com",
		"password": "testpassword",
	}
	testAPI("http://127.0.0.1:8080/login", loginPayload)

	registerPayload := map[string]string{
		"username": "newuser",
		"email":    "newuser@example.com",
		"password": "newpassword",
	}
	testAPI("http://127.0.0.1:8080/register", registerPayload)
}
