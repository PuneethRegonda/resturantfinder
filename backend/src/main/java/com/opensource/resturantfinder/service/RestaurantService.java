package com.opensource.resturantfinder.service;

import com.opensource.resturantfinder.entity.Category;
import com.opensource.resturantfinder.entity.OperatingHours;
import com.opensource.resturantfinder.entity.Restaurant;
import com.opensource.resturantfinder.entity.RestaurantDetails;
import com.opensource.resturantfinder.model.OperatingHoursRequest;
import com.opensource.resturantfinder.model.RestaurantRequest;
import com.opensource.resturantfinder.repository.CategoryRepository;
import com.opensource.resturantfinder.repository.RestaurantRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class RestaurantService {

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
        restaurant.setPriceLevel(request.getPriceLevel());
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
}