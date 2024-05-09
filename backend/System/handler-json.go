package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

func Login(router *http.ServeMux) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		switch r.Method {
		case "POST":
			{
				body, err := io.ReadAll(r.Body)
				check_err(err)

				var object LoginPayload
				err = json.Unmarshal(body, &object)
				check_err(err)
				check := login_account(object.Username, object.Email, object.Password)
				response := map[string]bool{
					"success": check,
				}
				json.NewEncoder(w).Encode(&response)
			}
		case "GET":
			fmt.Println("Method is not used")

		}
	}
}

func Register(router *http.ServeMux) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		switch r.Method {
		case "POST":
			{
				body, err := io.ReadAll(r.Body)
				check_err(err)

				var object RegisterPayload
				err = json.Unmarshal(body, &object)
				check_err(err)

				check := register_account(object.Username, object.Email, object.Password)
				response := map[string]bool{
					"success": check,
				}
				json.NewEncoder(w).Encode(&response)
			}
		case "GET":
			fmt.Println("Method is not used")
		}
	}
}

