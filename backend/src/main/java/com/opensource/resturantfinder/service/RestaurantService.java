package com.opensource.resturantfinder.service;

import com.opensource.resturantfinder.entity.*;
import com.opensource.resturantfinder.exception.ResourceNotFoundException;
import com.opensource.resturantfinder.model.*;
import com.opensource.resturantfinder.model.ReviewResponse;

import com.opensource.resturantfinder.repository.CategoryRepository;
import com.opensource.resturantfinder.repository.RestaurantRepository;
import com.opensource.resturantfinder.repository.ReviewRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class RestaurantService {

    @Autowired
    private ReviewRepository reviewRepository;

    private final RestaurantRepository restaurantRepository;
    private final CategoryRepository categoryRepository;

    @Autowired
    public RestaurantService(RestaurantRepository restaurantRepository, CategoryRepository categoryRepository) {
        this.restaurantRepository = restaurantRepository;
        this.categoryRepository = categoryRepository;
    }

    public Restaurant addRestaurant(RestaurantRequest request) {
        Restaurant restaurant = new Restaurant();
        restaurant.setName(request.getName());
        restaurant.setBusinessStatus(request.getBusinessStatus());
        restaurant.setLatitude(request.getLatitude());
        restaurant.setLongitude(request.getLongitude());
        restaurant.setIconUrl(request.getIconUrl());
        restaurant.setPriceLevel(PriceRange.fromValue(request.getPriceLevel()));
        restaurant.setRating(request.getRating());
        restaurant.setUserRatingsTotal(request.getUserRatingsTotal());
        restaurant.setVicinity(request.getVicinity());

        RestaurantDetails details = new RestaurantDetails();

        details.setDescription(request.getDescription());
        details.setPhoneNumber(request.getPhoneNumber());
        details.setWebsite(request.getWebsite());
        details.setCuisineType(request.getCuisineType());
        details.setIsVegetarian(request.getIsVegetarian());
        details.setIsVegan(request.getIsVegan());

        for (String categoryName : request.getCategories()) {
            Category category = categoryRepository.findByName(categoryName)
                    .orElseGet(() -> categoryRepository.save(new Category(categoryName)));
            restaurant.getCategories().add(category);
        }

        for (OperatingHoursRequest hourRequest : request.getOperatingHours()) {
            OperatingHours hours = new OperatingHours();
            hours.setDayOfWeek(hourRequest.getDayOfWeek());
            hours.setOpenTime(hourRequest.getOpenTime());
            hours.setCloseTime(hourRequest.getCloseTime());
            restaurant.getOperatingHours().add(hours);
        }
        restaurant.setDetails(details);
        details.setRestaurant(restaurant);
        return restaurantRepository.save(restaurant);
    }

    public RestaurantDetailsResponse getRestaurantDetails(Long restaurantId, String sortBy) {
        // Fetch restaurant details
        Restaurant restaurant = restaurantRepository.findWithDetailsById(restaurantId)
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

        // Build response
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
                reviews.stream().map(ReviewResponse::new).collect(Collectors.toList()),
                averageRating,
                totalReviews
        );
    }
    }