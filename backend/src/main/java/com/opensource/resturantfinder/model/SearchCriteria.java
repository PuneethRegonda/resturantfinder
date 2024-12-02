package com.opensource.resturantfinder.model;

import java.util.ArrayList;
import java.util.List;

public class SearchCriteria {
    private String name;
    private List<String> cuisines;
    private PriceRange priceRange;
    private Double minRating;
    private Double latitude;
    private Double longitude;
    private Double radius;
    private int page;
    private int size;
    private String sortBy;

    private SearchCriteria(Builder builder) {
        this.name = builder.name;
        this.cuisines = builder.cuisines;
        this.priceRange = builder.priceRange;
        this.minRating = builder.minRating;
        this.latitude = builder.latitude;
        this.longitude = builder.longitude;
        this.radius = builder.radius;
        this.page = builder.page;
        this.size = builder.size;
        this.sortBy = builder.sortBy;
    }

    public static class Builder {
        private String name;
        private List<String> cuisines = new ArrayList<>();
        private PriceRange priceRange;
        private Double minRating;
        private Double latitude;
        private Double longitude;
        private Double radius;
        private int page = 0;
        private int size = 20;
        private String sortBy = "relevance";

        public Builder setName(String name) {
            this.name = name;
            return this;
        }

        public Builder setCuisines(List<String> cuisines) {
            this.cuisines = cuisines;
            return this;
        }

        public Builder setPriceRange(PriceRange priceRange) {
            this.priceRange = priceRange;
            return this;
        }

        public Builder setMinRating(Double minRating) {
            this.minRating = minRating;
            return this;
        }

        public Builder setLocation(Double latitude, Double longitude, Double radius) {
            this.latitude = latitude;
            this.longitude = longitude;
            this.radius = radius;
            return this;
        }

        public Builder setPageable(int page, int size, String sortBy) {
            this.page = page;
            this.size = size;
            this.sortBy = sortBy;
            return this;
        }

        public SearchCriteria build() {
            return new SearchCriteria(this);
        }
    }

    // Getters for all fields

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<String> getCuisines() {
        return cuisines;
    }

    public void setCuisines(List<String> cuisines) {
        this.cuisines = cuisines;
    }

    public PriceRange getPriceRange() {
        return priceRange;
    }

    public void setPriceRange(PriceRange priceRange) {
        this.priceRange = priceRange;
    }

    public Double getMinRating() {
        return minRating;
    }

    public void setMinRating(Double minRating) {
        this.minRating = minRating;
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

    public Double getRadius() {
        return radius;
    }

    public void setRadius(Double radius) {
        this.radius = radius;
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public String getSortBy() {
        return sortBy;
    }

    public void setSortBy(String sortBy) {
        this.sortBy = sortBy;
    }
}