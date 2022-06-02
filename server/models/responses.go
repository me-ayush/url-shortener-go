package models

type User_Url_Add_Response struct {
	URL            string `json:"url"`
	Short          string `json:"short"`
	Clicks         string `json:"clicks"`
	ExpiryAt       string `json:"expiryat"`
	ActivationTime string `json:"activation_time"`
}
