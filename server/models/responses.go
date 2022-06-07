package models

type User_Url_Add_Response struct {
	URL            string `json:"url"`
	Short          string `json:"short"`
	Clicks         string `json:"clicks"`
	ExpiryAt       string `json:"expiryat"`
	ActivationTime string `json:"activation_time"`
}

type User_Url_See_All_Response struct {
	URL_ID         string `json:"url_id"`
	URL            string `json:"url"`
	Short          string `json:"short"`
	Clicks         string `json:"clicks"`
	ExpiryAt       string `json:"expiryat"`
	ActivationTime string `json:"activation_time"`
}

type Admin_Url_See_All_Response struct {
	URL_ID         string `json:"url_id"`
	User           string `json:"user"`
	URL            string `json:"url"`
	Short          string `json:"short"`
	Clicks         string `json:"clicks"`
	ExpiryAt       string `json:"expiryat"`
	ActivationTime string `json:"activation_time"`
}
