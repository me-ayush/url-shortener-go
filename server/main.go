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
	private.Post("/:user_id/updateprofile", routes.UpdateProfile)
	private.Post("/:user_id/add", routes.AddURL)
	private.Post("/:user_id/delete/:url_id", routes.DeleteURL)

	admin := app.Group("/admin")
	admin.Use(middleware.AuthAdmin)
	admin.Get("/users", routes.AllUsers)
	admin.Get("/links", routes.AllLinks)
	admin.Get("/message", routes.GetMessages)
	admin.Get("/users/:user_id", routes.GetUser)

	app.Get("/:url", routes.ResolveURL)
	app.Post("/api/v1", routes.ShortenURL)
	app.Post("/login", routes.Login)
	app.Post("/signup", routes.Signup)
	app.Post("/contact", routes.Contact)

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
