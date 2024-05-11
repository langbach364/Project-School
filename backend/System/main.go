package main

import (
	"net/http"

	"github.com/rs/cors"
)

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



func muxtiplexer_router(router *http.ServeMux) {
	router.HandleFunc("/login", Login(router))
	router.HandleFunc("/register", Register(router))  
}

func Create_server() {
	router := http.NewServeMux()
	muxtiplexer_router(router)

	server := http.Server{
		Addr:    ":8080",
		Handler: enable_middleware_cors(router),
	}
	server.ListenAndServe()
}

func main() {
    Create_server()
}
