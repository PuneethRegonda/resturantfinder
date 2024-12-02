package com.opensource.resturantfinder.model;

import java.util.List;

public class RestaurantDTO {
    private Long id;
    private String name;
    private String businessStatus;
    private Double latitude;
    private Double longitude;
    private String iconUrl;
    private PriceRange priceLevel;
    private Double rating;
    private Integer userRatingsTotal;
    private String vicinity;
    private RestaurantDetailsDTO details;
    private List<OperatingHoursDTO> operatingHours;
    private List<CategoryDTO> categories;

    // Getters and setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public PriceRange getPriceLevel() {
        return priceLevel;
    }

    public void setPriceLevel(PriceRange priceLevel) {
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

    public RestaurantDetailsDTO getDetails() {
        return details;
    }

    public void setDetails(RestaurantDetailsDTO details) {
        this.details = details;
    }

    public List<OperatingHoursDTO> getOperatingHours() {
        return operatingHours;
    }

    public void setOperatingHours(List<OperatingHoursDTO> operatingHours) {
        this.operatingHours = operatingHours;
    }

    public List<CategoryDTO> getCategories() {
        return categories;
    }

    public void setCategories(List<CategoryDTO> categories) {
        this.categories = categories;
    }
}