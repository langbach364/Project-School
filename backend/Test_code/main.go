package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

// Hàm change_password
func change_password(email string, newPassword string) (interface{}, interface{}) {
	query := fmt.Sprintf("UPDATE Users SET password > '%s' WHERE email = '%s'", newPassword, email)

	payload := map[string]string{
		"query": query,
	}

	responseData := sendPostRequest("http://127.0.0.1:5050/register", payload)
	return responseData["success"], responseData["status"]
}

// Hàm sendPostRequest
func sendPostRequest(url string, payload map[string]string) map[string]interface{} {
	jsonData, err := json.Marshal(payload)
	if err != nil {
		return nil
	}

	resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return nil
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil
	}

	var responseData map[string]interface{}
	err = json.Unmarshal(body, &responseData)
	if err != nil {
		return nil
	}

	return responseData
}

func main() {
	email := "bachlang364@gmail.com"
	newPassword := "newpassword123"

	success, status := change_password(email, newPassword)
	fmt.Printf("Success: %v, Status: %v\n", success, status)
}
