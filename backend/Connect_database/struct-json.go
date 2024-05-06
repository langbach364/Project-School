package main

import ()

type query struct {
	Query string `json:"query"`
}

type send_email struct {
	Email_sender    string `json:"email_sender"`
	Password_sender string `json:"password"`
	Email_recevier  string `json:"email_receiver"`
}

type check_code struct {
	Email string `json:"email"`
	Code  string `json:"code"`
}

type data_user struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Email    string `json:"email"`
}