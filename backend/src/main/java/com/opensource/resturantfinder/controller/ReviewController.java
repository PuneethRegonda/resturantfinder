package com.opensource.resturantfinder.controller;

import com.opensource.resturantfinder.common.ApiResponse;
import com.opensource.resturantfinder.model.ReviewRequest;
import com.opensource.resturantfinder.model.ReviewResponse;
import com.opensource.resturantfinder.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@Tag(name = "Reviews", description = "Endpoints for managing reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping
    @Operation(summary = "Submit a review", description = "Submit a review for a restaurant")
    public ResponseEntity<ApiResponse<Void>> submitReview(
            @RequestBody ReviewRequest reviewRequest,
            Principal principal,
            @RequestHeader("X-Request-ID") String requestId) {
        reviewService.submitReview(reviewRequest, principal.getName());
        return ResponseEntity.ok(ApiResponse.success(null, requestId));
    }

    @GetMapping("/{restaurantId}")
    @Operation(summary = "Get reviews", description = "Retrieve reviews for a restaurant")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getReviews(
            @PathVariable Long restaurantId,
            @RequestHeader("X-Request-ID") String requestId) {
        List<ReviewResponse> reviews = reviewService.getReviews(restaurantId);
        return ResponseEntity.ok(ApiResponse.success(reviews, requestId));
    }
}
