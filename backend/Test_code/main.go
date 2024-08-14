package main

import (
    "fmt"
    "sort"
    "strings"
)

func get_values_string(data map[string]interface{}) string {
    keys := make([]string, 0, len(data))
    for k := range data {
        keys = append(keys, k)
    }
    sort.Strings(keys)
    
    values := make([]string, 0, len(data))
    for _, k := range keys {
        values = append(values, fmt.Sprintf("'%v'", data[k]))
    }
    return strings.Join(values, ",")
}

func main() {
	data := map[string]interface{}{
		"name": 1,
		"age":  2,
		"city": 3,
	}
	values := get_values_string(data)
	fmt.Println(values)
}
