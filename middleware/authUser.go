package middleware

import (
	"url-shortener/helpers"

	"github.com/gofiber/fiber/v2"
)

func AuthUser(c *fiber.Ctx) error {
	clientToken := c.Get("token")
	if clientToken == "" {
		return c.Status(fiber.StatusNetworkAuthenticationRequired).JSON(fiber.Map{"error": "No Authotization header provided"})
	}

	claims, err := helpers.ValidateToken(clientToken)
	if err != "" {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err})
	}
	c.Set("email", claims.Email)
	c.Set("first_name", claims.First_name)
	c.Set("lirst_name", claims.Last_Name)
	c.Set("uid", claims.Uid)
	c.Set("user_type", claims.User_type)

	return c.Next()
}
