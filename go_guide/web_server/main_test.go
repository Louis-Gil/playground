package main

import (
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestIndexHandler(t *testing.T) {
	assert := assert.New(t)
	res := httptest.NewRecorder()
	req := httptest.NewRequest("GET", "/", nil)
	
	mux := MakeWebHandler()
	mux.ServeHTTP(res, req)

	assert.Equal(http.StatusOK, res.Code)
	data, _ := io.ReadAll(res.Body)
	assert.Equal("Hello, World", string(data))
}

func TestBarHandler(t *testing.T) {
	assert := assert.New(t)
	res := httptest.NewRecorder()
	req := httptest.NewRequest("GET", "/bar?id=3&name=duli", nil)
	
	mux := MakeWebHandler()
	mux.ServeHTTP(res, req)

	assert.Equal(http.StatusOK, res.Code)
	data, _ := io.ReadAll(res.Body)
	assert.Equal("Hello duli! id:3", string(data))
}

func TestJsonHandler(t *testing.T) {
	assert := assert.New(t)
	res := httptest.NewRecorder()
	req := httptest.NewRequest("GET", "/students", nil)

	mux := MakeWebHandler()
	mux.ServeHTTP(res, req)

	assert.Equal(http.StatusOK, res.Code)
	var list []Student
	err := json.NewDecoder(res.Body).Decode(&list)
	assert.Nil(err)
	assert.Equal(2, len(list))
	assert.Equal("duli", list[0].Name)
	assert.Equal("delta", list[1].Name)
}

func TestJsonHandler2(t *testing.T) {
	assert := assert.New(t)
	var student Student
	mux := MakeWebHandler()

	res := httptest.NewRecorder()
	req := httptest.NewRequest("GET", "/students/1", nil)

	mux.ServeHTTP(res, req)
	assert.Equal(http.StatusOK, res.Code)
	err := json.NewDecoder(res.Body).Decode(&student)
	assert.Nil(err)
	assert.Equal("duli", student.Name)

	res = httptest.NewRecorder()
	req = httptest.NewRequest("GET", "/students/2", nil)

	mux.ServeHTTP(res, req)
	assert.Equal(http.StatusOK, res.Code)
	err = json.NewDecoder(res.Body).Decode(&student)
	assert.Nil(err)
	assert.Equal("delta", student.Name)
}