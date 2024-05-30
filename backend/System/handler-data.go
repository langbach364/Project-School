package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
)


func sendPostRequest(url string, payload interface{}) (map[string]interface{}, error) {
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

	var responseData map[string]interface{}
	err = json.Unmarshal(body, &responseData)
	check_err(err)

	return responseData, nil
}

func login_account(username string, email string, password string) (bool, string) {
	payload := map[string]string{
		"username": username,
		"email":    email,
		"password": password,
	}

	responseData, err := sendPostRequest("http://127.0.0.1:5050/login", payload)
	check_err(err)

	fmt.Printf("Response Data: %v\n", responseData)

	success, ok := responseData["success"].(bool)
	if !ok {
		log.Fatal("Chuyển đổi dữ liệu thất bại")
	}

	return success, "Đã gửi dữ liệu"
}

func register_account(username string, email string, password string) (bool, string) {
	payload := map[string]string{
		"username": username,
		"email":    email,
		"password": password,
	}

	responseData, err := sendPostRequest("http://127.0.0.1:5050/register", payload)
	check_err(err)

	fmt.Printf("Response Data: %v\n", responseData)

	success, ok := responseData["success"].(bool)
	if !ok {
		log.Fatal("Chuyển đổi dữ liệu thất bại")
	}

	return success, "Đã gửi dữ liệu"
}

func search_products(search string) map[string]interface{} {
	list_product, err := sendPostRequest("http://127.0.0.1:5050/search", "SELECT category_name, product_name FROM Products")
	check_err(err)

	Search := Translate_VN_to_EN(search)
	words_search := split_string(Search)

	result := make(map[string]interface{})

	
}
