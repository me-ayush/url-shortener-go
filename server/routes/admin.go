package routes

import (
	"fmt"
	"url-shortener/controllers"
	"url-shortener/helpers"

	"github.com/gofiber/fiber/v2"
)

func AllUsers(c *fiber.Ctx) error {
	adminId := c.Get("id")
	userType := fmt.Sprint(c.Locals("user_type"))
	uid := fmt.Sprint(c.Locals("uid"))

	if err := helpers.CheckAdmin(adminId, userType, uid); err != "ok" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err})
	}

	allUsers, msg := controllers.GetAllUsers()
	if msg != "ok" {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": msg})
	}

	return c.Status(fiber.StatusOK).JSON(allUsers)
}
