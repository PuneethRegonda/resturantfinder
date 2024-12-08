package com.opensource.resturantfinder.service;

import com.opensource.resturantfinder.entity.Review;
import com.opensource.resturantfinder.entity.Restaurant;
import com.opensource.resturantfinder.entity.User;
import com.opensource.resturantfinder.exception.ResourceNotFoundException;
import com.opensource.resturantfinder.model.ReviewRequest;
import com.opensource.resturantfinder.model.ReviewResponse;
import com.opensource.resturantfinder.repository.ReviewRepository;
import com.opensource.resturantfinder.repository.RestaurantRepository;
import com.opensource.resturantfinder.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    public void submitReview(ReviewRequest reviewRequest, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Restaurant restaurant = restaurantRepository.findById(reviewRequest.getRestaurantId())
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));

        if (reviewRepository.existsByRestaurantIdAndUserId(restaurant.getId(), user.getId())) {
            throw new IllegalArgumentException("You have already reviewed this restaurant.");
        }

        Review review = new Review();
        review.setRestaurant(restaurant);
        review.setUser(user);
        review.setRating(reviewRequest.getRating());
        review.setReviewText(reviewRequest.getReviewText());

        reviewRepository.save(review);
    }

    public List<ReviewResponse> getReviews(Long restaurantId) {
        return reviewRepository.findByRestaurantId(restaurantId)
                .stream()
                .map(ReviewResponse::new) // Directly use the constructor with Review object
                .collect(Collectors.toList());
    }

}
