package com.opensource.resturantfinder.service;

import com.opensource.resturantfinder.entity.Restaurant;
import com.opensource.resturantfinder.model.PagedResponse;
import com.opensource.resturantfinder.model.RestaurantDTO;
import com.opensource.resturantfinder.model.SearchCriteria;
import com.opensource.resturantfinder.repository.RestaurantRepository;
import com.opensource.resturantfinder.mapper.RestaurantMapper;

import org.locationtech.jts.geom.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class RestaurantSearchService {

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private MapsApiService mapsApiService;

    @Autowired
    private RestaurantMapper restaurantMapper;
    private static final Logger log = LoggerFactory.getLogger(RestaurantSearchService.class);

    public PagedResponse<RestaurantDTO> searchRestaurants(SearchCriteria criteria) {
        // Define pagination and sorting
        Pageable pageable = PageRequest.of(criteria.getPage(), criteria.getSize(), Sort.by(criteria.getSortBy()));

        // Fetch results from the database
        Page<Restaurant> dbRestaurantPage = restaurantRepository.findAll(buildSpecification(criteria), pageable);
        log.info("Database results fetched: {}", dbRestaurantPage.getContent());

        // Map entities to DTOs
        List<RestaurantDTO> dbResults = dbRestaurantPage.getContent().stream()
                .map(restaurantMapper::toDto)
                .collect(Collectors.toList());
        log.info("Mapped DB results to DTOs: {}", dbResults);

        // Fetch results from Google Maps API
        List<RestaurantDTO> apiResults = mapsApiService.searchPlaces(criteria);
        log.info("API results fetched: {}", apiResults);

        // Merge and sort the results
        List<RestaurantDTO> mergedResults = Stream.concat(dbResults.stream(), apiResults.stream())
                .distinct()
                .sorted((r1, r2) -> Double.compare(r2.getRating(), r1.getRating())) // Sort by rating in descending order
                .collect(Collectors.toList());
        log.info("Merged and sorted results: {}", mergedResults);

        // Create a pageable response
        Page<RestaurantDTO> page = new PageImpl<>(mergedResults, pageable, mergedResults.size());
        log.info("Final pageable response created: {}", page);

        // Return the response
        return new PagedResponse<>(page);
    }

    private List<RestaurantDTO> mergeAndSortResults(List<RestaurantDTO> dbResults, List<RestaurantDTO> apiResults) {
        return Stream.concat(dbResults.stream(), apiResults.stream())
                .distinct()
                .sorted((r1, r2) -> Double.compare(r2.getRating(), r1.getRating()))
                .collect(Collectors.toList());
    }

    private Specification<Restaurant> buildSpecification(SearchCriteria criteria) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (criteria.getName() != null && !criteria.getName().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("name")), "%" + criteria.getName().toLowerCase() + "%"));
            }

            if (criteria.getCuisines() != null && !criteria.getCuisines().isEmpty()) {
                predicates.add(root.get("details").get("cuisineType").in(criteria.getCuisines()));
            }

            if (criteria.getPriceRange() != null) {
                predicates.add(cb.equal(root.get("priceLevel"), criteria.getPriceRange()));
            }

            if (criteria.getMinRating() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("rating"), criteria.getMinRating()));
            }

            if (criteria.getLatitude() != null && criteria.getLongitude() != null && criteria.getRadius() != null) {
                predicates.add(cb.le(calculateDistance(root, criteria, cb), criteria.getRadius()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private Expression<Double> calculateDistance(Root<Restaurant> root, SearchCriteria criteria, jakarta.persistence.criteria.CriteriaBuilder cb) {
        Expression<Double> lat = root.get("latitude");
        Expression<Double> lon = root.get("longitude");
        return cb.function("ST_Distance", Double.class,
                cb.function("ST_SetSRID", Point.class,
                        cb.function("ST_MakePoint", Point.class, lon, lat),
                        cb.literal(4326)
                ),
                cb.function("ST_SetSRID", Point.class,
                        cb.function("ST_MakePoint", Point.class, cb.literal(criteria.getLongitude()), cb.literal(criteria.getLatitude())),
                        cb.literal(4326)
                )
        );
    }
}
