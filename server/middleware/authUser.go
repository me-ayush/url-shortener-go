package middleware

import (
	"url-shortener/helpers"

	"github.com/gofiber/fiber/v2"
)

func AuthUser(c *fiber.Ctx) error {
	// userId := c.Params("user_id")
	clientToken := c.Get("token")

	if clientToken == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "No authorization header provided in user"})
	}

	claims, err := helpers.ValidateToken(clientToken)
	// fmt.Println(claims.Uid)
	// fmt.Println(userId)

	if err != "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err, "x": "x"})
	}

	c.Locals("email", claims.Email)
	c.Locals("first_name", claims.First_name)
	c.Locals("lirst_name", claims.Last_Name)
	c.Locals("uid", claims.Uid)
	c.Locals("user_type", claims.User_type)

	return c.Next()
}
