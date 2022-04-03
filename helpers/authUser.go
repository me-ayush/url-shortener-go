package helpers

import "fmt"

func VerifyPassword(userPassword string, providedPassword string) (bool, string) {
	// err := bcrypt.CompareHashAndPassword([]byte(providedPassword), []byte(userPassword))
	check := true
	msg := ""

	// if err != nil {
	// 	msg = fmt.Sprintf("email of password is incorrect")
	// 	check = false
	// }
	if userPassword != providedPassword {
		msg = fmt.Sprintf("password is wrong")
		check = false
	}
	return check, msg
}
