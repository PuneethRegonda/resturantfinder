package com.opensource.resturantfinder.controller;


import com.opensource.resturantfinder.model.PagedResponse;
import com.opensource.resturantfinder.model.RestaurantDTO;
import com.opensource.resturantfinder.model.SearchCriteria;
import com.opensource.resturantfinder.service.RestaurantSearchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

import com.opensource.resturantfinder.common.ApiResponse;

@RestController
@RequestMapping("/api/restaurants")
@Tag(name = "Restaurant Search", description = "Restaurant search API")
public class RestaurantSearchController {

    @Autowired
    private RestaurantSearchService searchService;

    private static final Logger log = LoggerFactory.getLogger(RestaurantSearchController.class);
    @GetMapping("/search")
    @Operation(summary = "Search restaurants", description = "Search for restaurants based on various criteria")
    public ResponseEntity<ApiResponse<PagedResponse<RestaurantDTO>>> searchRestaurants(
            @Parameter(description = "Restaurant name")
            @RequestParam(required = false) String name,
            @Parameter(description = "List of cuisines")
            @RequestParam(required = false) List<String> cuisineType,
            @Parameter(description = "Price range")
            @RequestParam(required = false) String priceLevel,
            @Parameter(description = "Minimum rating")
            @RequestParam(required = false) Double rating,
            @Parameter(description = "ZIP code for location-based search")
            @RequestParam(required = false) String zipcode,
            @Parameter(description = "Page number")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Number of items per page")
            @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Sort criteria")
            @RequestParam(defaultValue = "rating") String sortBy,
            @Parameter(description = "Category names for filtering (e.g., Vegan, Seafood)", required = false)
            @RequestParam(required = false) List<String> foodType,
            @Parameter(description = "Unique request identifier", required = true)
            @RequestHeader("X-Request-ID") String requestId
            ) {

        log.info("Incoming search request with parameters: name={}, cuisines={}, priceRange={}, minRating={}, zipcode={}, page={}, size={}, sortBy={}",
                name, cuisineType, priceLevel, rating, zipcode, page, size, sortBy);

        SearchCriteria criteria = new SearchCriteria.Builder()
                .setName(name != null ? name.trim() : null)
                .setCuisines(cuisineType != null && !cuisineType.isEmpty() ? new ArrayList<>(cuisineType) : new ArrayList<>()) // Ensure modifiable list

                .setPriceRange(priceLevel!=null && !priceLevel.isEmpty() ? Integer.valueOf(priceLevel) :  null)
                .setMinRating(rating != null ? rating : null) // Explicit check for null
                .setZipcode(zipcode != null && !zipcode.isEmpty() ? zipcode.trim() : null) // Trimmed zipcode
                .setFoodType(foodType != null && !foodType.isEmpty() ? new ArrayList<>(foodType) : new ArrayList<>()) // Map foodType
                .setPageable(page, size, sortBy != null ? sortBy.trim() : "rating") // Default sorting by rating
                .build();



        log.info("Built SearchCriteria: {}", criteria);

        PagedResponse<RestaurantDTO> results = searchService.searchRestaurants(criteria);
        return ResponseEntity.ok(ApiResponse.success(results, requestId));
    }

}