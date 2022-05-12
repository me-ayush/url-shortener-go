package helpers

import (
	"encoding/base64"
	"math/rand"
	"strings"
	"time"
)

func GenerateRandomString(length int) string {
	rand.Seed(time.Now().UnixNano())

	alphabet := "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"

	var sb strings.Builder

	l := len(alphabet)

	for i := 0; i < length; i++ {
		c := alphabet[rand.Intn(l)]
		sb.WriteByte(c)
	}

	return sb.String()
}

func GetAuthString(length int, email string) string {

	var finalString string
	a := GenerateRandomString(length / 2)
	finalString = finalString + a

	debyte := base64Encode([]byte(email))

	finalString = finalString + string(debyte)

	a = GenerateRandomString(length / 2)

	finalString = finalString + a

	// enbyte, err := base64Decode([]byte("YXl1c2hrdXNod2FoYTMyMUBnbWFpbC5jb20="))
	// if err != nil {
	// 	fmt.Println(err.Error())
	// }

	// fmt.Println(string(enbyte))

	return finalString
}

func base64Encode(src []byte) []byte {
	return []byte(base64.StdEncoding.EncodeToString(src))
}

func base64Decode(src []byte) ([]byte, error) {
	return base64.StdEncoding.DecodeString(string(src))
}
