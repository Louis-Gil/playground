package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
)

func main () {
	err := http.ListenAndServeTLS(":8080", "./../localhost.crt", "./../localhost.key", MakeWebHandler())
	if err != nil {
		log.Fatal(err)
	}
}

type Student struct {
	Name string
	Age int
	Score int
}

func MakeWebHandler() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "Hello, World")
	})
	mux.HandleFunc("/bar", barHandler)
	mux.HandleFunc("/student", StudentHandler)
	mux.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))

	return mux
}

func barHandler(w http.ResponseWriter, r *http.Request) {
	values := r.URL.Query()
	name := values.Get("name")
	if name == "" {
		name = "World"
	}
	id, _ := strconv.Atoi(values.Get("id"))
	fmt.Fprintf(w, "Hello %s! id:%d", name, id)
}

func StudentHandler(w http.ResponseWriter, r *http.Request) {
	var student = Student{"duli", 20, 90}
	data, _ := json.Marshal(student)
	w.Header().Add("content-type", "application/json")
	w.WriteHeader(http.StatusOK)
	fmt.Fprint(w, string(data))
}