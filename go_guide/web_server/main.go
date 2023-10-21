package main

import (
	"fmt"
	"net/http"
	"strconv"
)

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "Hello, World")
	})
	http.HandleFunc("/bar", barHandler)

	http.ListenAndServe(":8080", nil)
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