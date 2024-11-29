package com.opensource.resturantfinder.repository;

import com.opensource.resturantfinder.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    // Custom queries if needed
}