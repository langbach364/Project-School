package main

import (
	"log"
	"os"
	"strings"
	"time"
)

func check_err(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

func writeFile(content string, filePath string) {
	err := os.WriteFile(filePath, []byte(content), 0644)
	time.Sleep(1 * time.Second)

	if err != nil {
		log.Fatalf("không thể ghi vào file: %v", err)
	}
}

func readFile(filePath string) (string, error) {
	content, err := os.ReadFile(filePath)

	if err != nil {
		return "", err
	}
	return string(content), nil
}

func Translate_VN_to_EN(input string) string {
	writeFile(input, "../translate/trans.txt")

	content, err := readFile("../translate/trans_ed.txt")

	if err != nil {
		log.Fatalf("không thể đọc file: %v", err)
	}
	return content
}

//Time complexity: O(2n) n là độ dài của input
func split_string(input string) []string {
	input = strings.ToLower(input)
	result := strings.Split(input, " ")
	return result
}

//Time complexity: O(N * m) N là số lượng từ, m là độ dài của từ
func find_word(m map[string]interface{}, word string) string {
	word = strings.ToLower(word)
	for x, k := range m {
		if strings.HasPrefix(x, word) {
			return k.(string)
		}
	}
	return ""
}