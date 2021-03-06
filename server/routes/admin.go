package routes

import (
	"errors"
	"fmt"
	"url-shortener/controllers"
	"url-shortener/helpers"
	"url-shortener/models"

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
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
	}

	allUsers, msg := controllers.GetAllUsers()
	if msg != "ok" {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": msg})
	}

	return c.Status(fiber.StatusOK).JSON(allUsers)
}

func AllLinks(c *fiber.Ctx) error {

	if err := validateAdmin(c); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
	}

	allLinks, msg := controllers.GetAllLinks()
	if msg != "ok" {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": msg})
	}

	return c.Status(fiber.StatusOK).JSON(allLinks)
}

func GetUser(c *fiber.Ctx) error {
	if err := validateAdmin(c); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
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
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
	}
	allMsg, msg := controllers.GetAllMessages()

	if msg != "" {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": msg})
	}

	return c.Status(fiber.StatusOK).JSON(allMsg)
}

func DeleteMessage(c *fiber.Ctx) error {
	if err := validateAdmin(c); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
	}
	urlID := c.Params("url_id")
	msg, err := controllers.DelMessage(urlID)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(msg)

}

func DeleleLink(c *fiber.Ctx) error {
	if err := validateAdmin(c); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
	}
	urlID := c.Params("url_id")
	msg, err := controllers.DelLink(urlID)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(msg)
}

func AdminUserUpdate(c *fiber.Ctx) error {
	if err := validateAdmin(c); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
	}
	userID := c.Params("user_id")
	var user models.UpdateUser

	if err := c.BodyParser(&user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "cannot parse JSON in Admin Update User"})
	}

	msg, resp, err := controllers.AdminUpdateUser(userID, user)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	if resp <= 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User Not Updated"})
	}

	return c.Status(fiber.StatusOK).JSON(msg)
}

func DelUserAdmin(c *fiber.Ctx) error {
	if err := validateAdmin(c); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
	}
	userID := c.Params("user_id")

	msg, err := controllers.AdminDelUser(userID)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(msg)

}
