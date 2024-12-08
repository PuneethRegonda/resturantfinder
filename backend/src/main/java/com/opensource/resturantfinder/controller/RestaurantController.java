package com.opensource.resturantfinder.controller;

import com.opensource.resturantfinder.common.ApiResponse;
import com.opensource.resturantfinder.common.ErrorDetails;
import com.opensource.resturantfinder.entity.Restaurant;
import com.opensource.resturantfinder.model.RestaurantDetailsResponse;
import com.opensource.resturantfinder.model.RestaurantRequest;
import com.opensource.resturantfinder.security.JwtUtil;
import com.opensource.resturantfinder.service.RestaurantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/restaurants")
@Tag(name = "Restaurant", description = "Restaurant management API")
public class RestaurantController {

    private final RestaurantService restaurantService;
    private final JwtUtil jwtUtil;

    private final RestTemplate restTemplate;

    @Value("${google.api.key}")
    private String apiKey;

   
    @Autowired
    public RestaurantController(RestaurantService restaurantService, JwtUtil jwtUtil) {
        this.restaurantService = restaurantService;
        this.jwtUtil = jwtUtil;
        this.restTemplate = new RestTemplate();
    }

    @PostMapping
    @Operation(summary = "Add a new restaurant", description = "Creates a new restaurant entry")
    public ResponseEntity<ApiResponse<Restaurant>> addRestaurant(
            @Parameter(description = "Restaurant details", required = true)
            @Valid @RequestBody RestaurantRequest restaurantRequest,
            @Parameter(description = "Unique request identifier", required = true)
            @RequestHeader("X-Request-ID") String requestId,
            @RequestHeader("Authorization") String authorizationHeader) {

        String token = authorizationHeader.replace("Bearer ", "");
        String email = jwtUtil.extractUsername(token);
        Restaurant savedRestaurant = restaurantService.addRestaurant(restaurantRequest,email);
        return ResponseEntity.ok(ApiResponse.success(savedRestaurant, requestId));
    }


    @GetMapping("/{restaurantId}")
    @Operation(summary = "Get Restaurant Details", description = "Fetch details and reviews for a restaurant")
    public ResponseEntity<ApiResponse<RestaurantDetailsResponse>> getRestaurantDetails(
            @PathVariable Long restaurantId,
            @RequestParam(value = "sortBy", required = false, defaultValue = "recent") String sortBy,
            @RequestHeader("X-Request-ID") String requestId) {
        RestaurantDetailsResponse response = restaurantService.getRestaurantDetails(restaurantId, sortBy);
        return ResponseEntity.ok(ApiResponse.success(response, requestId));
    }
    @GetMapping("/google")
    public ResponseEntity<ApiResponse<ResponseEntity<String>>> getRestaurantDetailsfromGoogle(
        @RequestParam String location,
        @RequestHeader("X-Request-ID") String requestId
    ) {
        String googlePlacesUrl = String.format(
            "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=%s&radius=3000&type=restaurant&key=AIzaSyD3fqwSWp1IuXJesIHBUf1GEhWRVT_LJP4",
            location
        );
    
        ResponseEntity<String> response = restTemplate.getForEntity(googlePlacesUrl, String.class);
        return ResponseEntity.ok(ApiResponse.success(response, requestId));
    }   
   @GetMapping("/google-search")
public ResponseEntity<ApiResponse<ResponseEntity<String>>> searchRestaurants(
        @RequestParam(required = false) String location,
        @RequestParam(required = false) String query,
        @RequestParam(required = false) String cuisineType,
        @RequestParam(required = false) String foodType, // vegetarian, vegan, etc.
        @RequestParam(required = false) String priceLevel, // low, medium, high
        @RequestParam(required = false) Integer minRating,
        @RequestHeader("X-Request-ID") String requestId
) {
    // Base URL for Google Places Nearby Search API
    String googlePlacesUrl = String.format(
        "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=%s&radius=3000&type=restaurant&key=AIzaSyD3fqwSWp1IuXJesIHBUf1GEhWRVT_LJP4",
        URLEncoder.encode(location, StandardCharsets.UTF_8)
    );

    // Append optional query parameters for filtering
    if (query != null && !query.isEmpty()) {
        googlePlacesUrl += "&keyword=" + URLEncoder.encode(query, StandardCharsets.UTF_8);
    }

    if (cuisineType != null && !cuisineType.isEmpty()) {
        googlePlacesUrl += "&keyword=" + URLEncoder.encode(cuisineType, StandardCharsets.UTF_8);
    }

    if (foodType != null && !foodType.isEmpty()) {
        googlePlacesUrl += "&keyword=" + URLEncoder.encode(foodType, StandardCharsets.UTF_8);
    }

    if (priceLevel != null && !priceLevel.isEmpty()) {
        googlePlacesUrl += "&minprice=" + getPriceLevel(priceLevel);
    }

    // Note: The Google Places Nearby Search API does not support a direct `minrating` parameter.
    // You would need to filter results after fetching them if `minRating` is provided.
    
    // Call the Google API
    ResponseEntity<String> response = restTemplate.getForEntity(googlePlacesUrl, String.class);

    // Wrap and return the response
    return ResponseEntity.ok(ApiResponse.success(response, requestId));
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

@GetMapping("/google-photos")
public ResponseEntity<ApiResponse<List<String>>> getPhotosByPlaceId(
        @RequestParam String placeid,
        @RequestHeader("X-Request-ID") String requestId
) {
    try {
        // Construct the URL to fetch place details with photo references
        String placeDetailsUrl = String.format(
            "https://maps.googleapis.com/maps/api/place/details/json?place_id=%s&key=AIzaSyD3fqwSWp1IuXJesIHBUf1GEhWRVT_LJP4",
            URLEncoder.encode(placeid, StandardCharsets.UTF_8)
        );

        // Log the URL for debugging
        System.out.println("Google Place Details API URL: " + placeDetailsUrl);

        // Fetch place details to get photo references
        ResponseEntity<Map> placeDetailsResponse = restTemplate.exchange(placeDetailsUrl, HttpMethod.GET, null, Map.class);

        if (!placeDetailsResponse.getStatusCode().is2xxSuccessful() || placeDetailsResponse.getBody() == null) {
            System.err.println("Failed to fetch place details. Status: " + placeDetailsResponse.getStatusCode());
            ErrorDetails errorDetails = new ErrorDetails(
                String.valueOf(placeDetailsResponse.getStatusCodeValue()),
                "Failed to fetch place details from Google API",
                List.of("Ensure the placeid is correct", "Check Google API availability")
            );
            return ResponseEntity.status(placeDetailsResponse.getStatusCode()).body(
                ApiResponse.error(
                    errorDetails,
                    requestId
                )
            );
        }

        // Extract photo references from the response
        List<Map<String, Object>> photos = (List<Map<String, Object>>) ((Map<String, Object>) placeDetailsResponse.getBody().get("result")).get("photos");

        if (photos == null || photos.isEmpty()) {
            return ResponseEntity.ok(
                ApiResponse.success(
                    List.of(), // Return an empty list if no photos are available
                    requestId
                )
            );
        }

        // Generate photo URLs for each photo reference
        List<String> photoUrls = photos.stream()
                .map(photo -> {
                    String photoReference = (String) photo.get("photo_reference");
                    return String.format(
                        "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=%s&key=AIzaSyD3fqwSWp1IuXJesIHBUf1GEhWRVT_LJP4",
                        URLEncoder.encode(photoReference, StandardCharsets.UTF_8)
                    );
                })
                .toList();

        return ResponseEntity.ok(
            ApiResponse.success(
                photoUrls,
                requestId
            )
        );

    } catch (Exception e) {
        e.printStackTrace();
        ErrorDetails errorDetails = new ErrorDetails(
            "500",
            "Internal server error while retrieving photos",
            List.of("Unexpected error occurred", e.getMessage())
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
            ApiResponse.error(
                errorDetails,
                requestId
            )
        );
    }
}
 
}