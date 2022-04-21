package routes

import (
	"errors"
	"fmt"
	"url-shortener/controllers"
	"url-shortener/helpers"

	"github.com/gofiber/fiber/v2"
)

func validateAdmin(c *fiber.Ctx) error {
	adminId := c.Get("id")
	userType := fmt.Sprint(c.Locals("user_type"))
	uid := fmt.Sprint(c.Locals("uid"))

	if err := helpers.CheckAdmin(adminId, userType, uid); err != "ok" {
		return errors.New(err)
	}
	return nil
}

func AllUsers(c *fiber.Ctx) error {

	if err := validateAdmin(c); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	allUsers, msg := controllers.GetAllUsers()
	if msg != "ok" {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": msg})
	}

	return c.Status(fiber.StatusOK).JSON(allUsers)
}

func AllLinks(c *fiber.Ctx) error {

	if err := validateAdmin(c); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	allLinks, msg := controllers.GetAllLinks()
	if msg != "ok" {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": msg})
	}

	return c.Status(fiber.StatusOK).JSON(allLinks)
}

func GetUser(c *fiber.Ctx) error {
	if err := validateAdmin(c); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	userId := c.Params("user_id")
	user, msg := controllers.GetUserDetails(userId)

	if msg != "" {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": msg})
	}

	return c.Status(fiber.StatusOK).JSON(user)

}

func GetMessages(c *fiber.Ctx) error {
	if err := validateAdmin(c); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	allMsg, msg := controllers.GetAllMessages()

	if msg != "" {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": msg})
	}

	return c.Status(fiber.StatusOK).JSON(allMsg)
}
