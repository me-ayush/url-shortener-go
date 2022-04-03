package helpers

import (
	"errors"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

func CheckUserType(c *fiber.Ctx, role string) (err error) {
	userType := fmt.Sprint(c.Locals("user_type"))
	fmt.Println(role)
	err = nil
	if userType != role {
		err = errors.New("unathorized to access this resource")
		return err
	}
	err = errors.New("unathorized to access this resource")
	return err
}

func MatchuserTypeToUid(c *fiber.Ctx, userId string) (err error) {
	userType := fmt.Sprint(c.Locals("user_type"))
	uid := fmt.Sprint(c.Locals("uid"))
	err = nil

	// fmt.Println(userType)
	// fmt.Println(uid)
	// fmt.Println(userId)

	if userType == "USER" && uid != userId {
		err = errors.New("unathorized to access this resource")
		return err
	}
	err = CheckUserType(c, userType)
	// fmt.Println(err)
	return err
}
