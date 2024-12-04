package com.opensource.resturantfinder.service;

import com.opensource.resturantfinder.entity.Restaurant;
import com.opensource.resturantfinder.exception.ResourceNotFoundException;
import com.opensource.resturantfinder.model.DuplicateFlagResponse;
import com.opensource.resturantfinder.model.PagedResponse;
import com.opensource.resturantfinder.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class AdminRestaurantService {

    @Autowired
    private RestaurantRepository restaurantRepository;

    /**
     * Detect duplicate restaurants with pagination support.
     */
    public PagedResponse<DuplicateFlagResponse> detectDuplicates(int page, int size) {
        // Fetch paginated results
        Page<Restaurant> duplicates = restaurantRepository.findDuplicateRestaurants(PageRequest.of(page, size));

        // Map results to DuplicateFlagResponse
        return new PagedResponse<>(duplicates.map(restaurant -> DuplicateFlagResponse.builder()
                .restaurantId(restaurant.getId())
                .name(restaurant.getName())
                .vicinity(restaurant.getVicinity())
                .flagReason("Duplicate name and location detected")
                .build()));
    }

    /**
     * Remove a restaurant by ID.
     */
    public void removeRestaurant(Long restaurantId) {
        restaurantRepository.findById(restaurantId)
                .ifPresentOrElse(
                        restaurantRepository::delete,
                        () -> {
                            throw new ResourceNotFoundException("Restaurant not found");
                        }
                );
    }
}
