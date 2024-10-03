package com.opensource.resturantfinder.controller;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.swagger.v3.oas.annotations.tags.Tag;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/nearby-restaurants")
@Tag(name = "Google Restaurant Search", description = "Google Restaurant search API")
@Lazy
public class GooglePlacesController {
    private static final Logger log = LoggerFactory.getLogger(GooglePlacesController.class);

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${maps.api.key}")
    private String apiKey;

    public GooglePlacesController(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    @GetMapping("")
    public ResponseEntity<JsonNode> getNearbyRestaurants(@RequestParam String location) {
        try {
            log.info("Fetching nearby restaurants for location: {}", location);

            String googlePlacesUrl = String.format(
                    "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=%s&radius=3000&type=restaurant&key=%s",
                    location, apiKey);

            log.info("Calling Google Places API with URL: {}", googlePlacesUrl);

            ResponseEntity<String> response = restTemplate.getForEntity(googlePlacesUrl, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                // Convert the response string to JSON using ObjectMapper
                JsonNode jsonResponse = objectMapper.readTree(response.getBody());
                return ResponseEntity.ok(jsonResponse);
            } else {
                log.error("Failed to fetch restaurants, status: {}", response.getStatusCode());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(objectMapper.createObjectNode().put("error", "Failed to fetch nearby restaurants"));
            }
        } catch (Exception e) {
            log.error("Error while fetching restaurants: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(objectMapper.createObjectNode().put("error", "An error occurred while fetching nearby restaurants"));
        }
    }

    @GetMapping("/api/google-search-restaurants")
    public ResponseEntity<String> searchRestaurants(@RequestParam String zipcode) {
        try {
            // Step 1: Call Google Geocoding API to get latitude and longitude for the given zipcode
            String geocodingUrl = String.format(
                    "https://maps.googleapis.com/maps/api/geocode/json?address=%s&key=%s",
                    zipcode, apiKey);
    
            log.info("Calling Google Geocoding API with URL: {}", geocodingUrl);
    
            ResponseEntity<String> geocodingResponse = restTemplate.getForEntity(geocodingUrl, String.class);
    
            // Parse the response to extract latitude and longitude
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode geocodingJson = objectMapper.readTree(geocodingResponse.getBody());
    
            if (!geocodingJson.has("results") || geocodingJson.get("results").isEmpty()) {
                log.error("No results found for zipcode: {}", zipcode);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("No results found for the provided zipcode.");
            }
    
            JsonNode location = geocodingJson.get("results").get(0).get("geometry").get("location");
            double latitude = location.get("lat").asDouble();
            double longitude = location.get("lng").asDouble();
    
            log.info("Latitude: {}, Longitude: {}", latitude, longitude);
    
            // Step 2: Call Google Places API using the latitude and longitude
            String googlePlacesUrl = String.format(
                    "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=%f,%f&radius=3000&type=restaurant&key=%s",
                    latitude, longitude, apiKey);
    
            log.info("Calling Google Places API with URL: {}", googlePlacesUrl);
    
            ResponseEntity<String> placesResponse = restTemplate.getForEntity(googlePlacesUrl, String.class);
    
            // Return the response from Google Places API
            return ResponseEntity.ok(placesResponse.getBody());
    
        } catch (Exception e) {
            log.error("Error while searching restaurants: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while searching for restaurants.");
        }
    }
    
}
