package helpers

func CheckAdmin(adminId string, userType string, uid string) string {
	if userType != "ADMIN" {
		return "User Is Not Admin"
	}
	if uid != adminId {
		return "Admin Id Do Not Matched"
	}
	return "ok"
}
