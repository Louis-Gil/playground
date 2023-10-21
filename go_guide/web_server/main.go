package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sort"
	"strconv"

	"github.com/gorilla/mux"
)

func main () {
	err := http.ListenAndServeTLS(":8080", "./../localhost.crt", "./../localhost.key", MakeWebHandler())
	if err != nil {
		log.Fatal(err)
	}
}

type Student struct {
	Id int
	Name string
	Age int
	Score int
}

type Students []Student
func (s Students) Len() int {
	return len(s)
}
func (s Students) Swap(i, j int) {
	s[i], s[j] = s[j], s[i]
}
func (s Students) Less(i, j int) bool {
	return s[i].Id < s[j].Id
}

var students map[int]Student
var lastId int

func MakeWebHandler() http.Handler {
	mux := mux.NewRouter()
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "Hello, World")
	})
	mux.HandleFunc("/bar", BarHandler)
	mux.HandleFunc("/students", GetStudnetListHandler).Methods("GET")
	mux.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))

	students = make(map[int]Student)
	students[1] = Student{1, "duli", 20, 90}
	students[2] = Student{2, "delta", 18, 80}
	lastId = 2

	return mux
}

func BarHandler(w http.ResponseWriter, r *http.Request) {
	values := r.URL.Query()
	name := values.Get("name")
	if name == "" {
		name = "World"
	}
	id, _ := strconv.Atoi(values.Get("id"))
	fmt.Fprintf(w, "Hello %s! id:%d", name, id)
}

func GetStudnetListHandler(w http.ResponseWriter, r *http.Request) {
	list := make(Students, 0)
	for _, student := range students {
		list = append(list, student)
	}
	sort.Sort(list)
	w.WriteHeader(http.StatusOK)
	w.Header().Add("content-type", "application/json")
	json.NewEncoder(w).Encode(list)
}