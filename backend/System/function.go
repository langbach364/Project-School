package main

import (
	"fmt"
	"log"
	"os"
	"strings"
	"time"
	"unicode"
)

func check_err(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

func write_File(content string, filePath string) {
	err := os.WriteFile(filePath, []byte(content), 0644)
	time.Sleep(1 * time.Second)

	if err != nil {
		log.Fatalf("không thể ghi vào file: %v", err)
	}
}

func read_File(filePath string) (string, error) {
	content, err := os.ReadFile(filePath)

	if err != nil {
		return "", err
	}
	return string(content), nil
}

func Translate_VN_to_EN(input string) string {
	write_File(input, "../translate/trans.txt")

	content, err := read_File("../translate/trans_ed.txt")

	if err != nil {
		log.Fatalf("không thể đọc file: %v", err)
	}
	return content
}

func split_string(input string) []string {
	input = strings.Map(func(r rune) rune {
		if unicode.IsLetter(r) || unicode.IsNumber(r) || unicode.IsSpace(r) {
			return r
		}
		return -1
	}, input)

	input = strings.ToLower(strings.TrimSpace(input))
	result := strings.Split(input, " ")

	return result
}

func interface_to_string(value interface{}) []string {
	switch v := value.(type) {
	case []interface{}:
		var result []string
		for _, item := range v {
			result = append(result, interface_to_string(item)...)
		}
		return result
	default:
		return []string{fmt.Sprintf("%v", v)}
	}
}

// Tìm kiếm các giá trị trong key của map
func find_value_map(m map[string]interface{}, word string) []string {
	var result []string

	for _, value := range m {
		vStr := interface_to_string(value)
		for _, item := range vStr {
			if strings.HasPrefix(item, word) {
				result = append(result, item)
			}
		}
	}

	return result
}

// Tìm kiếm key trong map
func find_key_map(m map[string]interface{}, word string) []string {
	var result []string
	for k := range m {
		if strings.HasPrefix(k, word) {
			result = append(result, k)
		}
	}
	return result
}

// Xử lý kiểu dữ liệu interface sang chữ thường
func to_lowercase_map(m map[string]interface{}) map[string]interface{} {
	result := make(map[string]interface{})
	for key, value := range m {
		lowerKey := strings.ToLower(key)
		switch Value := value.(type) {
		case string:
			result[lowerKey] = strings.ToLower(Value)
		case map[string]interface{}:
			result[lowerKey] = to_lowercase_map(Value) // Dừng vòng lặp khi v là giá trị cuối của key
		case []interface{}:
			result[lowerKey] = to_lowercase_slice(Value) // Dừng vòng lặp khi v là giá trị cuối của key
		default:
			result[lowerKey] = Value
		}
	}
	return result
}

// xử lý slice của interface sang chữ thường (thuật ngữ slice hãy tra gg)
func to_lowercase_slice(slice []interface{}) []interface{} {
	result := make([]interface{}, len(slice))
	for i, value := range slice {
		switch Value := value.(type) {
		case string:
			result[i] = strings.ToLower(Value)
		case map[string]interface{}:
			result[i] = to_lowercase_map(Value)
		case []interface{}:
			result[i] = to_lowercase_slice(Value)
		default:
			result[i] = Value
		}
	}
	return result
}


func search_products(input []string, m map[string]interface{}) []string {
	var result []string
	for _, word := range input {
		if find_key_map(m, word) != nil {
			result = append(result, find_value_map(m, word)...)
			continue
		}
		result = append(result, find_value_map(m, word)...)
	}
	return result
}
