package com.opensource.resturantfinder.repository;

import com.opensource.resturantfinder.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByRestaurantId(Long restaurantId);

    boolean existsByRestaurantIdAndUserId(Long restaurantId, Long userId);

    List<Review> findByRestaurantIdOrderByCreatedAtDesc(Long restaurantId);

    List<Review> findByRestaurantIdOrderByRatingDesc(Long restaurantId);

    List<Review> findByRestaurantIdOrderByRatingAsc(Long restaurantId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.restaurant.id = :restaurantId")
    Double findAverageRatingByRestaurantId(@Param("restaurantId") Long restaurantId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.restaurant.id = :restaurantId")
    Long findReviewCountByRestaurantId(@Param("restaurantId") Long restaurantId);

}
