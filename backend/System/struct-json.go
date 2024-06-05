package main

import ()

type LoginPayload struct {
    Username string `json:"username"`
    Email    string `json:"email"`   
    Password string `json:"password"`
}

type RegisterPayload struct {
    Username string `json:"username"`
    Email    string `json:"email"`
    Password string `json:"password"`
}

type EmailPayload struct {
    Email string `json:"email"`
}

type UsernamePayload struct {
    Username string `json:"username"`
}

type SearchPayload struct {
    Search string `json:"search"`
}

type RattingPayload struct {
	Product_id int     `json:"product_id"`
	User_id    int     `json:"user_id"`
	Start      float64 `json:"start"`
	Comment    string  `json:"comment"`
}
