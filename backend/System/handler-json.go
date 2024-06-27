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
				check, status := login_account(object.Username, object.Email, object.Password)
				response := map[string]interface{}{
					"success": check,
					"status":  status,
				}
				json.NewEncoder(w).Encode(&response)
			}
		default:
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
				check, status := register_account(object.Username, object.Email, object.Password)
				response := map[string]interface{}{
					"success": check,
					"status":  status,
				}
				json.NewEncoder(w).Encode(&response)
			}
		default:
			fmt.Println("Method is not used")
		}
	}
}

func Search_products(router *http.ServeMux) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		switch r.Method {
		case "POST":
			{
				body, err := io.ReadAll(r.Body)
				check_err(err)

				var search SearchPayload
				err = json.Unmarshal(body, &search)
				check_err(err)

				products, status := select_product(search.Search)
				response := map[string]interface{}{
					"product": products,
					"status":  status,
				}
				json.NewEncoder(w).Encode(&response)
			}
		default:
			fmt.Println("Method is not used")
		}
	}
}

func Ratting_product(router *http.ServeMux) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		switch r.Method {
		case "POST":
			{
				body, err := io.ReadAll(r.Body)
				check_err(err)

				var ratting RattingPayload
				err = json.Unmarshal(body, &ratting)
				check_err(err)

				check, status := ratting_products(ratting)
				response := map[string]interface{}{
					"success": check,
					"status":  status,
				}
				json.NewEncoder(w).Encode(&response)
			}
		}
	}
}

func Send_code(router *http.ServeMux) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		switch r.Method {
		case "POST":
			{
				body, err := io.ReadAll(r.Body)
				check_err(err)

				var send_code EmailPayload
				err = json.Unmarshal(body, &send_code)
				check_err(err)

				check, status := send_email("hiencute3321@gmail.com", "ppmdpxecepmjvdhu", send_code.Email)
				reponseData := map[string]interface{}{
					"success": check,
					"status":  status,
				}
				json.NewEncoder(w).Encode(&reponseData)
			}
		default:
			fmt.Println("Method is not used")
		}
	}
}

func Verify_code(router *http.ServeMux) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		switch r.Method {
		case "POST":
			{
				body, err := io.ReadAll(r.Body)
				check_err(err)

				var cor_em CorrectEmail
				err = json.Unmarshal(body, &cor_em)
				check_err(err)

				check, status := verify_email(cor_em.Email, cor_em.Code)
				response := map[string]interface{}{
					"success": check,
					"status":  status,
				}
				json.NewEncoder(w).Encode(&response)
			}
		default:
			fmt.Println("Method is not used")
		}
	}
}

func Change_password(router *http.ServeMux) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		switch r.Method {
		case "POST":
			{
				body, err := io.ReadAll(r.Body)
				check_err(err)

				var change_pass ChangePassword
				err = json.Unmarshal(body, &change_pass)
				check_err(err)

				check, status := change_password(change_pass.Email, change_pass.NewPassword)
				response := map[string]interface{}{
					"success": check,
					"status":  status,
				}
				json.NewEncoder(w).Encode(&response)
			}
		default:
			fmt.Println("Method is not used")
		}
	}
}
