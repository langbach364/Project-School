package main

import (
	"encoding/json"
	"io"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
)

func insert_Handler(dbInfo *DBInfo) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case "POST":
			{
				body, err := io.ReadAll(r.Body)
				check_err(err)

				var query query
				err = json.Unmarshal(body, &query)
				check_err(err)

				if !Structure_query(query.Query, "insert") {
					json.NewEncoder(w).Encode("false")
					return;
				}
				_, err = dbInfo.DB.Exec(query.Query)
				check_err(err)
				json.NewEncoder(w).Encode("true")
			}
		}
	}
}

func select_Handler(dbInfo *DBInfo) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case "POST":
			{
				body, err := io.ReadAll(r.Body)
				check_err(err)

				var query query
				err = json.Unmarshal(body, &query)
				check_err(err)

				if !Structure_query(query.Query, "select") {
					json.NewEncoder(w).Encode("false")
					return;
				}

				rows, err := dbInfo.DB.Query(query.Query)
				check_err(err)
				defer rows.Close()

				var data []map[string]interface{}

				columns, err := rows.Columns()
				check_err(err)

				for rows.Next() {
					values := make([]interface{}, len(columns))
					valuePtrs := make([]interface{}, len(columns))
					for i := range values {
						valuePtrs[i] = &values[i]
					}

					err := rows.Scan(valuePtrs...)
					check_err(err)

					row := make(map[string]interface{})
					for i, column := range columns {
						row[column] = values[i]
					}

					data = append(data, row)
				}
				json.NewEncoder(w).Encode(data)
			}
		default:
			http.Error(w, "Method is not used", http.StatusMethodNotAllowed)
		}
	}
}

func delete_Handler(dbInfo *DBInfo) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case "POST":
			{
				body, err := io.ReadAll(r.Body)
				check_err(err)

				var query query
				err = json.Unmarshal(body, &query)
				check_err(err)

				if !Structure_query(query.Query, "delete") {
					json.NewEncoder(w).Encode("false")
					return;
				}

				_, err = dbInfo.DB.Exec(query.Query)
				check_err(err)

				json.NewEncoder(w).Encode("true")
			}
		default:
			http.Error(w, "Method is not used", http.StatusMethodNotAllowed)
		}
	}
}

func update_Handler(dbInfo *DBInfo) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case "POST":
			{
				body, err := io.ReadAll(r.Body)
				check_err(err)

				var query query
				err = json.Unmarshal(body, &query)
				check_err(err)

				if !Structure_query(query.Query, "update") {
					json.NewEncoder(w).Encode("false")
					return;
				}

				_, err = dbInfo.DB.Exec(query.Query)
				check_err(err)

				json.NewEncoder(w).Encode("true")
			}
		}
	}
}
func send_code() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case "POST":
			{
				body, err := io.ReadAll(r.Body)
				check_err(err)

				var send_token send_email
				err = json.Unmarshal(body, &send_token)
				check_err(err)

				Send_Email(send_token.Email_sender, send_token.Password_sender, send_token.Email_recevier)
				json.NewEncoder(w).Encode("true")
			}
		default:
			http.Error(w, "Method is not used", http.StatusMethodNotAllowed)
		}
	}
}

func session_account() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case "POST":
			{
				body, err := io.ReadAll(r.Body)
				check_err(err)

				var code check_code
				err = json.Unmarshal(body, &code)
				check_err(err)

				if verify_code(code.Email, code.Code) {
					json.NewEncoder(w).Encode("true")
				} else {
					json.NewEncoder(w).Encode("false")
				}
			}
		default:
			http.Error(w, "Method is not used", http.StatusMethodNotAllowed)
		}
	}
}
