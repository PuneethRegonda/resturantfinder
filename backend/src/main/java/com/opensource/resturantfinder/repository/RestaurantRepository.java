package com.opensource.resturantfinder.repository;

import com.opensource.resturantfinder.entity.Restaurant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long>, JpaSpecificationExecutor<Restaurant> {
    @Query("SELECT r FROM Restaurant r " +
            "LEFT JOIN FETCH r.details " +
            "LEFT JOIN FETCH r.operatingHours " +
            "LEFT JOIN FETCH r.categories " +
            "WHERE r.id = :restaurantId")
    Optional<Restaurant> findWithDetailsById(@Param("restaurantId") Long restaurantId);

    @Query("SELECT r FROM Restaurant r WHERE r.id = :restaurantId AND r.owner.email = :ownerEmail")
    Optional<Restaurant> findByIdAndOwnerEmail(@Param("restaurantId") Long restaurantId, @Param("ownerEmail") String ownerEmail);

    @Query("SELECT r FROM Restaurant r WHERE r.owner.email = :emailId")
    List<Restaurant> findByEmailId(@Param("emailId") String emailId);


    @Query("SELECT r FROM Restaurant r WHERE (r.name, r.vicinity) IN (" +
            "SELECT r1.name, r1.vicinity FROM Restaurant r1 GROUP BY r1.name, r1.vicinity HAVING COUNT(r1.id) > 1)")
    Page<Restaurant> findDuplicateRestaurants(Pageable pageable);


}

