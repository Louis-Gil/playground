package main

import (
	"crypto/tls"
	"fmt"
	"io"
	"log"
	"net/http"

	"github.com/quic-go/quic-go/http3"
)

func main() {
	client := &http.Client{
		Transport: &http3.RoundTripper{
			TLSClientConfig: &tls.Config{
				InsecureSkipVerify: true, 
			},
		},
	}

	resp, err := client.Get("https://localhost:8081/")
	if err != nil {
		log.Fatalf("Failed to fetch: %v", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Fatalf("Failed to read response: %v", err)
	}

	fmt.Printf("Response: %s\n", body)
}