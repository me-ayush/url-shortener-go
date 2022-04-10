package middleware

// func CheckRateLimit() func(c *fiber.Ctx) {
// 	mdb := database.OpenCollection(database.Client, "url-viewers")
// 	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
// 	var val models.ViewUsers
// 	err := mdb.FindOne(ctx, bson.M{"ip": c.IP()}).Decode(&val)
// 	defer cancel()
// 	if err != nil {
// 		var viewer models.ViewUsers = models.ViewUsers{
// 			Ip:    c.IP(),
// 			Quota: os.Getenv("API_QUOTA"),
// 			Reset: 30 * 60 * time.Second,
// 		}
// 		_, err := mdb.InsertOne(ctx, viewer)
// 		if err != nil {
// 			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "cannot connect to database"})
// 			// return fmt.Sprintf("cannot connect to database")
// 		}
// 	}
// 	valInt, _ := strconv.Atoi(val.Quota)
// 	if valInt-1 <= 0 {
// 		// limit := val.Reset
// 		// return false, c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{"error": "Rate limit exceeded", "rate_limit_reset": limit / time.Nanosecond / time.Minute})
// 		// return fmt.Sprintf("rate limit excced, reset in ", limit/time.Nanosecond/time.Minute)
// 	} else {
// 		val.Quota = strconv.Itoa(valInt - 1)
// 		_, err = mdb.UpdateOne(ctx,
// 			bson.M{"ip": val.Ip},
// 			bson.D{
// 				{"$set", bson.D{{"quota", val.Quota}}},
// 			},
// 		)
// 		if err != nil {
// 			// return false, c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "cannot connect to database"})
// 			// return fmt.Sprintf("cannot connect to database")
// 		}
// 	}
// 	// return fmt.Sprint()
// }
