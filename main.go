package main

import (
	"fmt"
	"log"
	"os"

	"url-shortener/middleware"
	"url-shortener/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/template/html"
	"github.com/joho/godotenv"
)

func setupRoutes(app *fiber.App) {

	private := app.Group("/user")
	private.Use(middleware.AuthUser)
	private.Get("/:user_id", routes.UserDetails)
	private.Post("/add", routes.AddURL)

	app.Get("/:url", routes.ResolveURL)
	app.Post("/api/v1", routes.ShortenURL)
	app.Post("/login", routes.Login)
	app.Post("/signup", routes.Signup)

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

	// app := fiber.New()

	engine := html.New("./templates", ".html")
	app := fiber.New(fiber.Config{
		Views: engine,
	})

	app.Use(logger.New())

	setupRoutes(app)

	log.Fatal(app.Listen(PORT))
}
