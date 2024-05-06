package main

import (
	_ "github.com/go-sql-driver/mysql"
)

func choose_login(username string, email string) (string, string) {
	db, err := Connect_owner()
	check_err(err)

	storePassword := ""
	if username != "" {
		err = db.DB.QueryRow("SELECT password FROM Users WHERE username =?", username).Scan(&storePassword)
		check_err(err)
		return storePassword, username
	} else {
		err = db.DB.QueryRow("SELECT password FROM Users WHERE email =?", email).Scan(&storePassword)
		check_err(err)
		return storePassword, email
	}
}

func check_login(username string, email string, passoword string) bool {
	storePassword, log := choose_login(username, email)
	if storePassword == "" {
		return false
	}
	pass := encode_data(log, passoword, 2)
	return storePassword == pass
}

func check_username(username string) bool {
	db, err := Connect_owner()
	check_err(err)
	
	var count int
	err = db.DB.QueryRow("SELECT COUNT(*) FROM Users WHERE username =?", username).Scan(&count)
	check_err(err)
	return count == 0
}

func check_email(email string) bool {
	db, err := Connect_owner()
	check_err(err)

	var count int
	err = db.DB.QueryRow("SELECT COUNT(*) FROM Users WHERE email =?", email).Scan(&count)
	check_err(err)
	return count == 0
}

func sign_up(email string, Password string, username string) {
	pass := encode_data(email, Password, 2)
	db, err := Connect_owner()
	check_err(err)
	if username != "" {
		_, err = db.DB.Exec("INSERT INTO Users (username, password, email) VALUES (?,?,?)", username, pass, email)
		check_err(err)
	} else {
		_, err = db.DB.Exec("INSERT INTO Users (email, password) VALUES (?,?)", email, pass)
	}
	check_err(err)
}
