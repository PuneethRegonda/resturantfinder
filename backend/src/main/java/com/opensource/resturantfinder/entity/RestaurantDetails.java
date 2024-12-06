package com.opensource.resturantfinder.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "restaurant_details")
public class RestaurantDetails {
    @Id
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "restaurant_id")
    @JsonIgnore
    private Restaurant restaurant;


    private String description;
    private String phoneNumber;
    private String website;
    private String cuisineType;
    private Boolean isVegetarian;
    private Boolean isVegan;

    public Restaurant getRestaurant() {
        return restaurant;
    }

    public void setRestaurant(Restaurant restaurant) {
        this.restaurant = restaurant;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public String getCuisineType() {
        return cuisineType;
    }

    public void setCuisineType(String cuisineType) {
        this.cuisineType = cuisineType;
    }

    public Boolean getIsVegetarian() {
        return isVegetarian;
    }

    public void setIsVegetarian(Boolean vegetarian) {
        isVegetarian = vegetarian;
    }

    public Boolean getIsVegan() {
        return isVegan;
    }

    public void setIsVegan(Boolean vegan) {
        isVegan = vegan;
    }
}