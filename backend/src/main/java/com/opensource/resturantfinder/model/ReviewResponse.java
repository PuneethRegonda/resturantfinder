package com.opensource.resturantfinder.model;

import com.opensource.resturantfinder.entity.Review;

import java.time.LocalDateTime;

public class ReviewResponse {

    private Long id;
    private String userName; // Reviewer name
    private Integer rating;  // Rating (1 to 5)
    private String reviewText; // Review content
    private LocalDateTime createdAt; // Time of review submission

    // Constructor to map from Review entity
    public ReviewResponse(Review review) {
        this.id = review.getId();
        this.userName = (review.getUser() != null) ? review.getUser().getName() : "Anonymous";
        this.rating = review.getRating();
        this.reviewText = review.getReviewText();
        this.createdAt = review.getCreatedAt();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getReviewText() {
        return reviewText;
    }

    public void setReviewText(String reviewText) {
        this.reviewText = reviewText;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
