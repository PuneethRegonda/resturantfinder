package com.opensource.resturantfinder.service;

import com.opensource.resturantfinder.entity.*;
import com.opensource.resturantfinder.exception.ResourceNotFoundException;
import com.opensource.resturantfinder.model.*;
import com.opensource.resturantfinder.repository.CategoryRepository;
import com.opensource.resturantfinder.repository.RestaurantRepository;
import com.opensource.resturantfinder.repository.ReviewRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final CategoryRepository categoryRepository;
    private final ReviewRepository reviewRepository;

    @Autowired
    public RestaurantService(RestaurantRepository restaurantRepository, CategoryRepository categoryRepository,ReviewRepository reviewRepository) {
        this.restaurantRepository = restaurantRepository;
        this.categoryRepository = categoryRepository;
        this.reviewRepository = reviewRepository;

    }

    @Transactional
    public Restaurant addRestaurant(RestaurantRequest request) {
          // Extract the email from the token
    String email = jwtUtil.extractUsername(authToken.substring(7)); // Assuming "Bearer " prefix

    // Fetch the user by email
    User owner = userService.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        // Create a new Restaurant object
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
        restaurant.setOwner(request.getOwner());
        // Map details
        RestaurantDetails details = new RestaurantDetails();
        details.setDescription(request.getDescription());
        details.setPhoneNumber(request.getPhoneNumber());
        details.setWebsite(request.getWebsite());
        details.setCuisineType(request.getCuisineType());
        details.setIsVegetarian(request.getIsVegetarian());
        details.setIsVegan(request.getIsVegan());
        details.setRestaurant(restaurant); // Link details back to the restaurant
    
        // Map categories
        Set<Category> categories = request.getCategories().stream()
                .map(name -> categoryRepository.findByName(name)
                        .orElseGet(() -> categoryRepository.save(new Category(name))))
                .collect(Collectors.toSet());
        restaurant.setCategories(categories);
    
        // Map operating hours
        List<OperatingHours> operatingHours = request.getOperatingHours().stream()
        .map(req -> {
            OperatingHours hours = new OperatingHours();
            hours.setDayOfWeek(req.getDayOfWeek());
            hours.setOpenTime(req.getOpenTime());
            hours.setCloseTime(req.getCloseTime());
            return hours;
        })
        .collect(Collectors.toList());
restaurant.setOperatingHours(operatingHours);

    
        // Set details
        restaurant.setDetails(details);
    
        // Save the restaurant
        return restaurantRepository.save(restaurant);
    }
    


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