package com.opensource.resturantfinder.controller;


import com.opensource.resturantfinder.model.PriceRange;
import com.opensource.resturantfinder.model.RestaurantDTO;
import com.opensource.resturantfinder.model.SearchCriteria;
import com.opensource.resturantfinder.service.RestaurantSearchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.opensource.resturantfinder.common.ApiResponse;

@RestController
@RequestMapping("/api/restaurants")
@Tag(name = "Restaurant Search", description = "Restaurant search API")
public class RestaurantSearchController {

    @Autowired
    private RestaurantSearchService searchService;

    @GetMapping("/search")
    @Operation(summary = "Search restaurants", description = "Search for restaurants based on various criteria")
    public ResponseEntity<ApiResponse<Page<RestaurantDTO>>> searchRestaurants(
            @Parameter(description = "Restaurant name")
            @RequestParam(required = false) String name,
            @Parameter(description = "List of cuisines")
            @RequestParam(required = false) List<String> cuisines,
            @Parameter(description = "Price range")
            @RequestParam(required = false) PriceRange priceRange,
            @Parameter(description = "Minimum rating")
            @RequestParam(required = false) Double minRating,
            @Parameter(description = "Latitude for location-based search")
            @RequestParam(required = false) Double latitude,
            @Parameter(description = "Longitude for location-based search")
            @RequestParam(required = false) Double longitude,
            @Parameter(description = "Search radius in meters")
            @RequestParam(required = false) Double radius,
            @Parameter(description = "Page number")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Number of items per page")
            @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Sort criteria")
            @RequestParam(defaultValue = "relevance") String sortBy,
            @Parameter(description = "Unique request identifier", required = true)
            @RequestHeader("X-Request-ID") String requestId) {

        SearchCriteria criteria = new SearchCriteria.Builder()
                .setName(name)
                .setCuisines(cuisines)
                .setPriceRange(priceRange)
                .setMinRating(minRating)
                .setLocation(latitude, longitude, radius)
                .setPageable(page, size, sortBy)
                .build();

        Page<RestaurantDTO> results = searchService.searchRestaurants(criteria);
        return ResponseEntity.ok(ApiResponse.success(results, requestId));
    }
}