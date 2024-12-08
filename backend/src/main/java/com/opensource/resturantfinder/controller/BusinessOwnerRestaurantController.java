package com.opensource.resturantfinder.controller;

import com.opensource.resturantfinder.common.ApiResponse;
import com.opensource.resturantfinder.model.RestaurantResponse;
import com.opensource.resturantfinder.model.RestaurantUpdateRequest;
import com.opensource.resturantfinder.service.BusinessOwnerRestaurantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/owner/restaurants")
@Tag(name = "Business Owner Restaurants", description = "Manage owned restaurants")
public class BusinessOwnerRestaurantController {

    @Autowired
    private BusinessOwnerRestaurantService businessOwnerRestaurantService;
    private static final Logger log = LoggerFactory.getLogger(BusinessOwnerRestaurantController.class);

    @PutMapping("/{restaurantId}")
    @Operation(summary = "Update Restaurant", description = "Update details of an owned restaurant")
    public ResponseEntity<ApiResponse<RestaurantResponse>> updateRestaurant(
            @PathVariable Long restaurantId,
            @RequestBody RestaurantUpdateRequest updateRequest,
            Principal principal,
            @RequestHeader("X-Request-ID") String requestId) {
        String email = principal.getName();
        System.out.println("Business Owner "+email);
        log.info("Business Owner : {}" , email);
        RestaurantResponse response = businessOwnerRestaurantService.updateRestaurant(restaurantId, email, updateRequest);
        return ResponseEntity.ok(ApiResponse.success(response, requestId));
    }

    @GetMapping
    @Operation(summary = "View Owned Restaurants", description = "Fetch all restaurants owned by the BusinessOwner")
    public ResponseEntity<ApiResponse<List<RestaurantResponse>>> getOwnedRestaurants(
            Principal principal,
            @RequestHeader("X-Request-ID") String requestId) {
        String email = principal.getName();
        log.info("Business Owner : {}" , email);
        List<RestaurantResponse> responses = businessOwnerRestaurantService.getOwnedRestaurants(email);
        return ResponseEntity.ok(ApiResponse.success(responses, requestId));
    }
}
