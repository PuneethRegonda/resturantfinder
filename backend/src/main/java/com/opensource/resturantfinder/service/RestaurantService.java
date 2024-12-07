package com.opensource.resturantfinder.service;

import com.opensource.resturantfinder.entity.*;
import com.opensource.resturantfinder.exception.ResourceNotFoundException;
import com.opensource.resturantfinder.model.*;
import com.opensource.resturantfinder.repository.CategoryRepository;
import com.opensource.resturantfinder.repository.RestaurantRepository;
import com.opensource.resturantfinder.repository.ReviewRepository;
import com.opensource.resturantfinder.repository.UserRepository;
import com.opensource.resturantfinder.security.JwtUtil;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final CategoryRepository categoryRepository;
    private final ReviewRepository reviewRepository;
    private final JwtUtil jwtUtil; // Utility class to handle token parsing
    private final UserRepository userRepository;

    @Autowired
    public RestaurantService(RestaurantRepository restaurantRepository, CategoryRepository categoryRepository, ReviewRepository reviewRepository, JwtUtil jwtUtil, UserRepository userRepository) {
        this.restaurantRepository = restaurantRepository;
        this.categoryRepository = categoryRepository;
        this.reviewRepository = reviewRepository;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }
    public Restaurant addRestaurant(RestaurantRequest request, String email) {
        // Fetch the owner by email
        User owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found with email: " + email));

        // Create and populate the Restaurant entity
        Restaurant restaurant = new Restaurant();
        restaurant.setName(request.getName());
        restaurant.setBusinessStatus(request.getBusinessStatus());
        restaurant.setLatitude(request.getLatitude());
        restaurant.setLongitude(request.getLongitude());
        restaurant.setIconUrl(request.getIconUrl());
        restaurant.setPriceLevel(request.getPriceLevel());
        restaurant.setRating(request.getRating());
        restaurant.setUserRatingsTotal(request.getUserRatingsTotal());
        restaurant.setVicinity(request.getVicinity());
        restaurant.setOwner(owner);
        restaurant.setZipcode(request.getZipcode());
        // Populate RestaurantDetails
        RestaurantDetails details = new RestaurantDetails();
        details.setDescription(request.getDescription());
        details.setPhoneNumber(request.getPhoneNumber());
        details.setWebsite(request.getWebsite());
        details.setCuisineType(request.getCuisineType());
        details.setIsVegetarian(request.getIsVegetarian());
        details.setIsVegan(request.getIsVegan());
        restaurant.setDetails(details);
        details.setRestaurant(restaurant);

        // Handle categories: Reuse or create new
        for (String categoryName : request.getCategories()) {
            Category category = categoryRepository.findByName(categoryName)
                    .orElseGet(() -> {
                        Category newCategory = new Category();
                        newCategory.setName(categoryName);
                        return categoryRepository.save(newCategory);
                    });
            restaurant.getCategories().add(category);
        }

        // Handle operating hours
        for (OperatingHoursRequest hourRequest : request.getOperatingHours()) {
            OperatingHours hours = new OperatingHours();
            hours.setDayOfWeek(hourRequest.getDayOfWeek());
            hours.setOpenTime(hourRequest.getOpenTime());
            hours.setCloseTime(hourRequest.getCloseTime());
            hours.setRestaurant(restaurant);
            restaurant.getOperatingHours().add(hours);
        }

        // Save and return the restaurant
        return restaurantRepository.save(restaurant);
    }

//
//    public Restaurant addRestaurant(RestaurantRequest request,String email) {
//
//        User owner = userRepository.findByEmail(email)
//                .orElseThrow(() -> new ResourceNotFoundException("Owner not found with email: " + email));
//
//        Restaurant restaurant = new Restaurant();
//        restaurant.setOwner(owner);
//
//        restaurant.setName(request.getName());
//        restaurant.setBusinessStatus(request.getBusinessStatus());
//        restaurant.setLatitude(request.getLatitude());
//        restaurant.setLongitude(request.getLongitude());
//        restaurant.setIconUrl(request.getIconUrl());
//        restaurant.setPriceLevel(request.getPriceLevel());
//        restaurant.setRating(request.getRating());
//        restaurant.setUserRatingsTotal(request.getUserRatingsTotal());
//        restaurant.setVicinity(request.getVicinity());
//
//        RestaurantDetails details = new RestaurantDetails();
//
//        details.setDescription(request.getDescription());
//        details.setPhoneNumber(request.getPhoneNumber());
//        details.setWebsite(request.getWebsite());
//        details.setCuisineType(request.getCuisineType());
//        details.setIsVegetarian(request.getIsVegetarian());
//        details.setIsVegan(request.getIsVegan());
//
//        for (String categoryName : request.getCategories()) {
//            Category category = categoryRepository.findByName(categoryName)
//                    .orElseGet(() -> categoryRepository.save(new Category(categoryName)));
//            restaurant.getCategories().add(category);
//        }
//
//        for (OperatingHoursRequest hourRequest : request.getOperatingHours()) {
//            OperatingHours hours = new OperatingHours();
//            hours.setDayOfWeek(hourRequest.getDayOfWeek());
//            hours.setOpenTime(hourRequest.getOpenTime());
//            hours.setCloseTime(hourRequest.getCloseTime());
//            restaurant.getOperatingHours().add(hours);
//        }
//        restaurant.setDetails(details);
//        details.setRestaurant(restaurant);
//        return restaurantRepository.save(restaurant);
//    }

    public RestaurantDetailsResponse getRestaurantDetails(Long restaurantId, String sortBy) {
        // Fetch restaurant details
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));

        // Fetch reviews based on sort order
        List<Review> reviews;
        switch (sortBy.toLowerCase()) {
            case "highest":
                reviews = reviewRepository.findByRestaurantIdOrderByRatingDesc(restaurantId);
                break;
            case "lowest":
                reviews = reviewRepository.findByRestaurantIdOrderByRatingAsc(restaurantId);
                break;
            default:
                reviews = reviewRepository.findByRestaurantIdOrderByCreatedAtDesc(restaurantId);
        }

        // Aggregate data
        Double averageRating = reviewRepository.findAverageRatingByRestaurantId(restaurantId);
        Long totalReviews = reviewRepository.findReviewCountByRestaurantId(restaurantId);

        return new RestaurantDetailsResponse(
                restaurant.getName(),
                restaurant.getBusinessStatus(),
                restaurant.getLatitude(),
                restaurant.getLongitude(),
                restaurant.getIconUrl(),
                restaurant.getPriceLevel(),
                restaurant.getRating(),
                restaurant.getUserRatingsTotal(),
                restaurant.getVicinity(),
                restaurant.getDetails(),
                restaurant.getOperatingHours(),
                restaurant.getCategories(),
                reviews.stream()
                        .map(ReviewResponse::new)
                        .collect(Collectors.toList()),
                averageRating,
                totalReviews
        );
    }

}