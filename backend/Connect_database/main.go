package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
	"github.com/rs/cors"
)

type DBInfo struct {
	DB *sql.DB
}

func check_err(err error) {
	if err != nil {
		println(err)
		log.Fatal(err)
	}
}

func enable_middleware_cors(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		Cors := cors.New(cors.Options{
			AllowedHeaders:   []string{"Accept", "Accept-Language", "Content-Language", "Content-Type"},
			AllowedMethods:   []string{"POST"},
			AllowedOrigins:   []string{"http://127.0.0.1:5500"},
			AllowCredentials: true,
			Debug:            true,
		})
		Cors.ServeHTTP(w, r, next.ServeHTTP)
	})
}

func Connect_owner() (*DBInfo, error) {
	connStr := "root:@ztegc4DF9F4E@tcp(localhost:3306)/Manager"
	db, err := sql.Open("mysql", connStr)
	check_err(err)
	return &DBInfo{DB: db}, nil
}

func Router_login(router *http.ServeMux) {
	router.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		switch r.Method {
		case "POST":
			{
				body, err := io.ReadAll(r.Body)
				check_err(err)

				var data data_user
				err = json.Unmarshal(body, &data)
				check_err(err)

				if check_login(data.Username, data.Email, data.Password) {
					json.NewEncoder(w).Encode("true")
				} else {
					json.NewEncoder(w).Encode("false")
				}
			}
		case "GET":
			fmt.Println("Method is not used")
		}
	})
}

func Router_register(router *http.ServeMux) {
	router.HandleFunc("/register", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		switch r.Method {
		case "POST":
			{
				body, err := io.ReadAll(r.Body)
				check_err(err)
				var data data_user
				err = json.Unmarshal(body, &data)
				check_err(err)
				sign_up(data.Username, data.Email, data.Password)
				json.NewEncoder(w).Encode("true")
			}
		case "GET":
			fmt.Println("Method is not used")
		}
	})
}

func Router_check_username(router *http.ServeMux) {
	router.HandleFunc("/check_username", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		switch r.Method {
		case "POST":
			{
				body, err := io.ReadAll(r.Body)
				check_err(err)

				var username string
				err = json.Unmarshal(body, &username)
				check_err(err)

				if check_username(username) {
					json.NewEncoder(w).Encode("false")
					return
				} else {
					json.NewEncoder(w).Encode("true")
					return
				}
			}
		case "GET":
			fmt.Println("Method is not used")
		}
	})
}

func Router_check_email(router *http.ServeMux) {
	router.HandleFunc("/check_email", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		switch r.Method {
		case "POST":
			{
				body, err := io.ReadAll(r.Body)
				check_err(err)
				var email string
				err = json.Unmarshal(body, &email)
				check_err(err)
				if check_email(email) {
					json.NewEncoder(w).Encode("false")
					return
				} else {
					json.NewEncoder(w).Encode("true")
					return
				}
			}
		case "GET":
			fmt.Println("Method is not used")
		}
	})
}

func muxtiplexer_router(router *http.ServeMux) {
	Router_login(router)
	Router_check_username(router)
	Router_check_email(router)

	dbInfo_owner, err := Connect_owner()
	check_err(err)
	router.HandleFunc("/select", select_Handler(dbInfo_owner))
	router.HandleFunc("/delete", delete_Handler(dbInfo_owner))
	router.HandleFunc("/insert", insert_Handler(dbInfo_owner))
	router.HandleFunc("/update", update_Handler(dbInfo_owner))
	router.HandleFunc("/check_session", session_account())
	router.HandleFunc("/send_code", send_code())
}

func Create_server() {
	router := http.NewServeMux()
	muxtiplexer_router(router)

	server := http.Server{
		Addr:    ":5050",
		Handler: enable_middleware_cors(router),
	}
	server.ListenAndServe()
}

func main() {
	Create_server()
}
