package com.opensource.resturantfinder.controller;

import com.opensource.resturantfinder.common.ApiResponse;
import com.opensource.resturantfinder.entity.Restaurant;
import com.opensource.resturantfinder.model.RestaurantRequest;
import com.opensource.resturantfinder.service.RestaurantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/restaurants")
@Tag(name = "Restaurant", description = "Restaurant management API")
public class RestaurantController {

    private final RestaurantService restaurantService;

    @Autowired
    public RestaurantController(RestaurantService restaurantService) {
        this.restaurantService = restaurantService;
    }

    @PostMapping
    @Operation(summary = "Add a new restaurant", description = "Creates a new restaurant entry")
    public ResponseEntity<ApiResponse<Restaurant>> addRestaurant(
            @Parameter(description = "Restaurant details", required = true)
            @Valid @RequestBody RestaurantRequest restaurantRequest,
            @Parameter(description = "Unique request identifier", required = true)
            @RequestHeader("X-Request-ID") String requestId) {
        Restaurant savedRestaurant = restaurantService.addRestaurant(restaurantRequest);
        return ResponseEntity.ok(ApiResponse.success(savedRestaurant, requestId));
    }
}