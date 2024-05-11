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
			AllowedOrigins:   []string{"*"},
			AllowCredentials: false,
			Debug:            true,
		})
		Cors.ServeHTTP(w, r, next.ServeHTTP)
	})
}

func Connect_owner() (*DBInfo, error) {
	connStr := "root:@ztegc4df9f4e@tcp(localhost:3306)/SHOP"
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

				check := check_login(data.Username, data.Email, data.Password)
				response := map[string]bool{
					"success": check,
				}
				json.NewEncoder(w).Encode(&response)
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

				check := sign_up(data.Username, data.Email, data.Password)
				response := map[string]bool{
					"success": check,
				}
				json.NewEncoder(w).Encode(&response)
			}
		case "GET":
			fmt.Println("Method is not used")
		}
	})
}

func muxtiplexer_router(router *http.ServeMux) {
	Router_login(router)
	Router_register(router)

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
