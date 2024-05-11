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
