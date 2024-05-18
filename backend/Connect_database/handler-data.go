package main

import (
	"database/sql"

	_ "github.com/go-sql-driver/mysql"
)

func choose_login(username string, email string) (string, string, error) {
	db, err := Connect_owner()
	check_err(err)

	storePassword := ""
	var log string
	if username != "" {
		err = db.DB.QueryRow("SELECT password FROM Users WHERE username = ?", username).Scan(&storePassword)
		log = username
	} else {
		err = db.DB.QueryRow("SELECT password FROM Users WHERE email = ?", email).Scan(&storePassword)
		log = email
	}
	if err != nil {
		if err == sql.ErrNoRows {
			return "", "", nil
		}
		return "", "", err
	}
	return storePassword, log, nil
}

func check_login(username string, email string, password string) bool {
	storePassword, log, err := choose_login(username, email)
	if err != nil {
		return false
	}
	if storePassword == "" {
		return false
	}
	pass := encode_data(log, password, 2)
	return storePassword == pass
}
func check_username(username string) bool {
	db, err := Connect_owner()
	check_err(err)

	count := 0
	err = db.DB.QueryRow("SELECT COUNT(*) FROM Users WHERE username =?", username).Scan(&count)
	return err == nil && count == 0
}

func check_email(email string) bool {
	db, err := Connect_owner()
	check_err(err)

	count := 0
	err = db.DB.QueryRow("SELECT COUNT(*) FROM Users WHERE email =?", email).Scan(&count)
	return err == nil && count == 0
}

func sign_up(username string, email string, Password string) (bool, string) {
	pass := encode_data(email, Password, 2)
	db, err := Connect_owner()
	if err != nil {
		return false, "Error"
	}

	if !check_email(email) {
		return false, "Email đã tồn tại"
	}

	if !check_username(username) {
		return false, "username đã tồn tại"
	}

	if username == "" {
		_, err = db.DB.Exec("INSERT INTO Users (email, password) VALUES (?, ?)", email, pass)
		if err != nil {
			return false, "error"
		}
		return true, "Thêm thành công"
	}

	_, err = db.DB.Exec("INSERT INTO Users (username, email, password) VALUES (?, ?, ?)", username, email, pass)
	if err != nil {
		return false, "error"
	}
	return true, "Thêm thành công"
}

