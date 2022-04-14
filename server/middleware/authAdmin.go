package middleware

import (
	"url-shortener/helpers"

	"github.com/gofiber/fiber/v2"
)

func AuthAdmin(c *fiber.Ctx) error {
	adminToken := c.Get("token")
	if adminToken == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "No Authotization header provided"})
	}
	claims, err := helpers.ValidateToken(adminToken)
	if err != "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err})
	}
	c.Locals("email", claims.Email)
	c.Locals("first_name", claims.First_name)
	c.Locals("lirst_name", claims.Last_Name)
	c.Locals("uid", claims.Uid)
	c.Locals("user_type", claims.User_type)

	return c.Next()
}
