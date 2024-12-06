package com.opensource.resturantfinder.model;

public class ReviewRequest {
    private Long restaurantId;
    private Integer rating;
    private String reviewText;

    public Long getRestaurantId() {
        return restaurantId;
    }

    public void setRestaurantId(Long restaurantId) {
        this.restaurantId = restaurantId;
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

    @Override
    public String toString() {
        return "ReviewRequest{" +
                "restaurantId=" + restaurantId +
                ", rating=" + rating +
                ", reviewText='" + reviewText + '\'' +
                '}';
    }
}
