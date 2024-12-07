package com.opensource.resturantfinder.controller;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@CrossOrigin(origins = "*")
public class GooglePlacesController {

    private final RestTemplate restTemplate;

    @Value("${google.api.key}")
    private String apiKey;

    public GooglePlacesController() {
        this.restTemplate = new RestTemplate();
    }

    @GetMapping("/api/nearby-restaurants")
    public ResponseEntity<String> getNearbyRestaurants(@RequestParam String location) {
        String googlePlacesUrl = String.format(
                "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=%s&radius=3000&type=restaurant&key=%s",
                location, apiKey);

        ResponseEntity<String> response = restTemplate.getForEntity(googlePlacesUrl, String.class);
        return ResponseEntity.ok(response.getBody());
    }

    @GetMapping("/api/get-restaurant-details")
    public ResponseEntity<String> getRestaurantDetails(
            @RequestParam(required = false) String placeId,
            @RequestParam(required = false) String name
    ) {
        String googlePlacesUrl = "";

        try {
            if (placeId != null) {
                // Use placeId to get details
                googlePlacesUrl = String.format(
                        "https://maps.googleapis.com/maps/api/place/details/json?place_id=%s&key=%s",
                        URLEncoder.encode(placeId, StandardCharsets.UTF_8), apiKey);
            } else if (name != null) {
                // Search by restaurant name
                googlePlacesUrl = String.format(
                        "https://maps.googleapis.com/maps/api/place/textsearch/json?query=%s+restaurant&type=restaurant&key=%s",
                        URLEncoder.encode(name, StandardCharsets.UTF_8), apiKey);
            } else {
                return ResponseEntity.badRequest().body("No valid parameters provided");
            }

            ResponseEntity<String> response = restTemplate.getForEntity(googlePlacesUrl, String.class);
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to retrieve restaurant details");
        }
    }

    @GetMapping("/api/photo")
    public ResponseEntity<byte[]> getPhoto(@RequestParam String photoReference) {
        try {
            String googlePhotoUrl = String.format(
                    "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=%s&key=%s",
                    photoReference, apiKey);

            // Logging the URL being called to confirm its correctness
            System.out.println("Google Photo API URL: " + googlePhotoUrl);

            ResponseEntity<byte[]> response = restTemplate.exchange(googlePhotoUrl, HttpMethod.GET, null, byte[].class);
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                System.out.println("Successfully retrieved photo from Google API");
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .body(response.getBody());
            } else {
                System.err.println("Failed to retrieve photo from Google API. Status: " + response.getStatusCode());
                return ResponseEntity.status(response.getStatusCode()).body(null);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/api/search-restaurants")
    public ResponseEntity<String> searchRestaurants(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String cuisineType,
            @RequestParam(required = false) String foodType, // vegetarian, vegan, etc.
            @RequestParam(required = false) String priceLevel, // low, medium, high
            @RequestParam(required = false) Integer minRating
    ) {
        // Construct the base Google Places API URL for text search
        String googlePlacesUrl = String.format(
                "https://maps.googleapis.com/maps/api/place/textsearch/json?query=%s+restaurant&type=restaurant&key=%s",
                URLEncoder.encode(query, StandardCharsets.UTF_8), apiKey
        );

        // Append optional query parameters for further filtering
        if (cuisineType != null && !cuisineType.isEmpty()) {
            googlePlacesUrl += "&query=" + URLEncoder.encode(cuisineType, StandardCharsets.UTF_8);
        }

        if (foodType != null && !foodType.isEmpty()) {
            googlePlacesUrl += "&query=" + URLEncoder.encode(foodType, StandardCharsets.UTF_8);
        }

        if (priceLevel != null && !priceLevel.isEmpty()) {
            googlePlacesUrl += "&minprice=" + getPriceLevel(priceLevel);
        }

        if (minRating != null) {
            googlePlacesUrl += "&minrating=" + minRating;
        }

        // Make a request to the Google API
        ResponseEntity<String> response = restTemplate.getForEntity(googlePlacesUrl, String.class);
        return ResponseEntity.ok(response.getBody());
    }

    private int getPriceLevel(String priceLevel) {
        switch (priceLevel.toLowerCase()) {
            case "low":
                return 0;
            case "medium":
                return 1;
            case "high":
                return 2;
            default:
                return 0;
        }
    }
    

}
