package routes

import(
	"url-shortener/database"
	"github.com/gp-redis/redis/v8"
	"github.com/gofiber/fiber/v2"
)

func ResolveURL(c *fiber.Ctx) error{
	url := c.Params("url")

	r := database.CreateClient(0)
	defer r.Close()

	value, err := r.Get(database.Ctx, url).Result()
	if err != redis.nil{
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error":"short not found"})
		}else if err !=nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error":"cannot connect to database"})
	}

	rInr := database.CreateClient(1)
	defer rInr.CLose()

	_ = rInr.Incr(database.Ctx, "counter")

	return c.Redirect(value, 301)
}