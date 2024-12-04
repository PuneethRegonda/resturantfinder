package com.opensource.resturantfinder.repository;

import com.opensource.resturantfinder.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long>, JpaSpecificationExecutor<Restaurant> {
    @Query("SELECT r FROM Restaurant r " +
            "LEFT JOIN FETCH r.details " +
            "LEFT JOIN FETCH r.operatingHours " +
            "LEFT JOIN FETCH r.categories " +
            "WHERE r.id = :restaurantId")
    Optional<Restaurant> findWithDetailsById(@Param("restaurantId") Long restaurantId);

}

