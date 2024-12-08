package com.opensource.resturantfinder.controller;

import com.opensource.resturantfinder.common.ApiResponse;
import com.opensource.resturantfinder.model.DuplicateFlagResponse;
import com.opensource.resturantfinder.model.PagedResponse;
import com.opensource.resturantfinder.service.AdminRestaurantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/restaurants")
@Tag(name = "Admin Restaurants", description = "Admin operations for managing restaurants")
public class AdminRestaurantController {

    @Autowired
    private AdminRestaurantService adminRestaurantService;

    @GetMapping("/duplicates")
    @Operation(summary = "Detect Duplicates", description = "Detect and flag duplicate restaurants with pagination")
    public ResponseEntity<ApiResponse<PagedResponse<DuplicateFlagResponse>>> detectDuplicates(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestHeader("X-Request-ID") String requestId) {
        PagedResponse<DuplicateFlagResponse> duplicates = adminRestaurantService.detectDuplicates(page, size);
        return ResponseEntity.ok(ApiResponse.success(duplicates, requestId));
    }
    @PostMapping("/delete")
    @Operation(summary = "Delete Multiple Restaurants", description = "Delete multiple restaurants by their IDs")
    public ResponseEntity<ApiResponse<Void>> deleteMultipleRestaurants(
            @RequestBody List<Long> restaurantIds,
            @RequestHeader("X-Request-ID") String requestId) {
        adminRestaurantService.removeRestaurants(restaurantIds);
        return ResponseEntity.ok(ApiResponse.success(null, requestId));
    }

}
