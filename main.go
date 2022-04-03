package main

import (
	"fmt"
	"log"
	"os"

	"url-shortener/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/joho/godotenv"
)

func setupRoutes(app *fiber.App) {
	app.Get("/:url", routes.ResolveURL)
	app.Post("/api/v1", routes.ShortenURL)

	app.Get("/", func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{"Message": "Success"})
	})
}

func main() {
	err := godotenv.Load()
	PORT := os.Getenv("PORT")
	if PORT == "" {
		PORT = ":3000"
	}

	if err != nil {
		fmt.Println(err)
	}

	app := fiber.New()

	app.Use(logger.New())

	setupRoutes(app)

	log.Fatal(app.Listen(PORT))
}
