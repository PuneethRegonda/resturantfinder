package com.opensource.resturantfinder.model;

import java.util.Collections;
import java.util.List;

public class RestaurantDTO {
    private Long id;
    private String name;
    private String businessStatus;
    private Double latitude;
    private Double longitude;
    private String iconUrl;
    private Integer priceLevel;
    private Double rating;
    private Integer userRatingsTotal;
    private String vicinity;
    private RestaurantDetailsDTO details;
    private List<OperatingHoursDTO> operatingHours;
    private List<CategoryDTO> categories;
    private String place_id;

    public String getPlace_id() {
        return place_id == null ? "" : place_id;
    }

    public void setPlace_id(String place_id) {
        this.place_id = place_id;
    }

    // Getters and setters with null safety
    public Long getId() {
        return id == null ? 0L : id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name == null ? "" : name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBusinessStatus() {
        return businessStatus == null ? "" : businessStatus;
    }

    public void setBusinessStatus(String businessStatus) {
        this.businessStatus = businessStatus;
    }

    public Double getLatitude() {
        return latitude == null ? 0.0 : latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude == null ? 0.0 : longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getIconUrl() {
        return iconUrl == null ? "" : iconUrl;
    }

    public void setIconUrl(String iconUrl) {
        this.iconUrl = iconUrl;
    }

    public Integer getPriceLevel() {
        return priceLevel == null ? 0 : priceLevel;
    }

    public void setPriceLevel(Integer priceLevel) {
        this.priceLevel = priceLevel;
    }

    public Double getRating() {
        return rating == null ? 0.0 : rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Integer getUserRatingsTotal() {
        return userRatingsTotal == null ? 0 : userRatingsTotal;
    }

    public void setUserRatingsTotal(Integer userRatingsTotal) {
        this.userRatingsTotal = userRatingsTotal;
    }

    public String getVicinity() {
        return vicinity == null ? "" : vicinity;
    }

    public void setVicinity(String vicinity) {
        this.vicinity = vicinity;
    }

    public RestaurantDetailsDTO getDetails() {
        return details == null ? new RestaurantDetailsDTO() : details;
    }

    public void setDetails(RestaurantDetailsDTO details) {
        this.details = details;
    }

    public List<OperatingHoursDTO> getOperatingHours() {
        return operatingHours == null ? Collections.emptyList() : operatingHours;
    }

    public void setOperatingHours(List<OperatingHoursDTO> operatingHours) {
        this.operatingHours = operatingHours;
    }

    public List<CategoryDTO> getCategories() {
        return categories == null ? Collections.emptyList() : categories;
    }

    public void setCategories(List<CategoryDTO> categories) {
        this.categories = categories;
    }

    @Override
    public String toString() {
        return "RestaurantDTO{" +
                "id=" + getId() +
                ", name='" + getName() + '\'' +
                ", businessStatus='" + getBusinessStatus() + '\'' +
                ", latitude=" + getLatitude() +
                ", longitude=" + getLongitude() +
                ", iconUrl='" + getIconUrl() + '\'' +
                ", priceLevel=" + getPriceLevel() +
                ", rating=" + getRating() +
                ", userRatingsTotal=" + getUserRatingsTotal() +
                ", vicinity='" + getVicinity() + '\'' +
                ", details=" + getDetails() +
                ", operatingHours=" + getOperatingHours() +
                ", categories=" + getCategories() +
                ", place_id='" + getPlace_id() + '\'' +
                '}';
    }
}
