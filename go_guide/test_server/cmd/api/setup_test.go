package main

import (
	"os"
	"testing"
	"test_server/pkg/repository/dbrepo"
)

var app application

func TestMain(m *testing.M) {
	app.DB = &dbrepo.TestDBRepo{}
	app.Domain = "example.com"
	app.JWTSecret = "verysecret"
	os.Exit(m.Run())
}