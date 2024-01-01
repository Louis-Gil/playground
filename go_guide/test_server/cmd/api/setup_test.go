package main

import (
	"os"
	"test_server/pkg/repository/dbrepo"
	"testing"
)

var app application
var expiredToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiYXVkIjoiZXhhbXBsZS5jb20iLCJleHAiOjE3MDM3MTg4MTEsImlzcyI6ImV4YW1wbGUuY29tIiwibmFtZSI6IkpvaG4gRG9lIiwic3ViIjoiMSJ9.WYnseOzwpI3N0i-sLjIXOLLMeGpot0KmEbDdqTBCo94"

func TestMain(m *testing.M) {
	app.DB = &dbrepo.TestDBRepo{}
	app.Domain = "example.com"
	app.JWTSecret = "verysecret"
	os.Exit(m.Run())
}
