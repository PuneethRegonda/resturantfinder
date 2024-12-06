package com.opensource.resturantfinder.model;

import com.opensource.resturantfinder.entity.Category;
import com.opensource.resturantfinder.entity.OperatingHours;
import com.opensource.resturantfinder.entity.RestaurantDetails;

import java.util.List;
import java.util.Set;

public class RestaurantDetailsResponse {

    private String name;
    private String businessStatus;
    private Double latitude;
    private Double longitude;
    private String iconUrl;
    private Integer priceLevel;
    private Double rating; // Average rating (if stored directly in the entity)
    private Integer userRatingsTotal;
    private String vicinity;
    private RestaurantDetails details;
    private List<OperatingHours> operatingHours;
    private Set<Category> categories;
    private List<ReviewResponse> reviews; // List of mapped review responses
    private Double averageRating; // Calculated average rating
    private Long totalReviews;    // Total number of reviews

    // Full-argument constructor
    public RestaurantDetailsResponse(
            String name,
            String businessStatus,
            Double latitude,
            Double longitude,
            String iconUrl,
            Integer priceLevel,
            Double rating,
            Integer userRatingsTotal,
            String vicinity,
            RestaurantDetails details,
            List<OperatingHours> operatingHours,
            Set<Category> categories,
            List<ReviewResponse> reviews,
            Double averageRating,
            Long totalReviews) {
        this.name = name;
        this.businessStatus = businessStatus;
        this.latitude = latitude;
        this.longitude = longitude;
        this.iconUrl = iconUrl;
        this.priceLevel = priceLevel;
        this.rating = rating;
        this.userRatingsTotal = userRatingsTotal;
        this.vicinity = vicinity;
        this.details = details;
        this.operatingHours = operatingHours;
        this.categories = categories;
        this.reviews = reviews;
        this.averageRating = averageRating;
        this.totalReviews = totalReviews;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBusinessStatus() {
        return businessStatus;
    }

    public void setBusinessStatus(String businessStatus) {
        this.businessStatus = businessStatus;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getIconUrl() {
        return iconUrl;
    }

    public void setIconUrl(String iconUrl) {
        this.iconUrl = iconUrl;
    }

    public Integer getPriceLevel() {
        return priceLevel;
    }

    public void setPriceLevel(Integer priceLevel) {
        this.priceLevel = priceLevel;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Integer getUserRatingsTotal() {
        return userRatingsTotal;
    }

    public void setUserRatingsTotal(Integer userRatingsTotal) {
        this.userRatingsTotal = userRatingsTotal;
    }

    public String getVicinity() {
        return vicinity;
    }

    public void setVicinity(String vicinity) {
        this.vicinity = vicinity;
    }

    public RestaurantDetails getDetails() {
        return details;
    }

    public void setDetails(RestaurantDetails details) {
        this.details = details;
    }

    public List<OperatingHours> getOperatingHours() {
        return operatingHours;
    }

    public void setOperatingHours(List<OperatingHours> operatingHours) {
        this.operatingHours = operatingHours;
    }

    public Set<Category> getCategories() {
        return categories;
    }

    public void setCategories(Set<Category> categories) {
        this.categories = categories;
    }

    public List<ReviewResponse> getReviews() {
        return reviews;
    }

    public void setReviews(List<ReviewResponse> reviews) {
        this.reviews = reviews;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    public Long getTotalReviews() {
        return totalReviews;
    }

    public void setTotalReviews(Long totalReviews) {
        this.totalReviews = totalReviews;
    }
}
