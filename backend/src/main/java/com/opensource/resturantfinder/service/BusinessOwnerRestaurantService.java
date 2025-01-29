package com.opensource.resturantfinder.service;

import com.opensource.resturantfinder.entity.Restaurant;
import com.opensource.resturantfinder.exception.ResourceNotFoundException;
import com.opensource.resturantfinder.model.RestaurantResponse;
import com.opensource.resturantfinder.model.RestaurantUpdateRequest;
import com.opensource.resturantfinder.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BusinessOwnerRestaurantService {

    @Autowired
    private RestaurantRepository restaurantRepository;

    /**
     * Update restaurant details for the owner.
     */
    public RestaurantResponse updateRestaurant(Long restaurantId, String email, RestaurantUpdateRequest updateRequest) {
        Restaurant restaurant = restaurantRepository.findByIdAndOwnerEmail(restaurantId, email)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found or access denied"));

        restaurant.setName(updateRequest.getName());
        restaurant.getDetails().setDescription(updateRequest.getDescription());
        restaurant.getDetails().setPhoneNumber(updateRequest.getPhoneNumber());
        restaurant.getDetails().setWebsite(updateRequest.getWebsite());

        // Save changes
        Restaurant updatedRestaurant = restaurantRepository.save(restaurant);

        return new RestaurantResponse(
                updatedRestaurant.getId(),
                updatedRestaurant.getName(),
                updatedRestaurant.getDetails().getDescription(),
                updatedRestaurant.getDetails().getPhoneNumber(),
                updatedRestaurant.getDetails().getWebsite()
        );
    }

    /**
     * Fetch all restaurants owned by a BusinessOwner.
     */
    public List<RestaurantResponse> getOwnedRestaurants(String emailId) {
        List<Restaurant> restaurants = restaurantRepository.findByEmailId(emailId);

        return restaurants.stream()
                .map(r -> new RestaurantResponse(
                        r.getId(),
                        r.getName(),
                        r.getDetails().getDescription(),
                        r.getDetails().getPhoneNumber(),
                        r.getDetails().getWebsite()
                ))
                .collect(Collectors.toList());
    }
}
