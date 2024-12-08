package com.opensource.resturantfinder.service;

import com.opensource.resturantfinder.entity.Category;
import com.opensource.resturantfinder.entity.Restaurant;
import com.opensource.resturantfinder.entity.RestaurantCategory;
import com.opensource.resturantfinder.entity.RestaurantDetails;
import com.opensource.resturantfinder.model.PagedResponse;
import com.opensource.resturantfinder.model.RestaurantDTO;
import com.opensource.resturantfinder.model.SearchCriteria;
import com.opensource.resturantfinder.repository.RestaurantRepository;
import com.opensource.resturantfinder.mapper.RestaurantMapper;

import jakarta.persistence.criteria.*;
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

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Arrays;
import java.util.List;

@Service
public class RestaurantSearchService {

    private static final Logger log = LoggerFactory.getLogger(RestaurantSearchService.class);

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private MapsApiService mapsApiService;

    @Autowired
    private RestaurantMapper restaurantMapper;

    // Predefined list of valid sort fields
    private static final List<String> VALID_SORT_FIELDS = Arrays.asList("name", "rating", "priceLevel");

    public PagedResponse<RestaurantDTO> searchRestaurants(SearchCriteria criteria) {
        // Validate and set the sortBy field
        String validatedSortBy = validateSortBy(criteria.getSortBy());
        Pageable pageable = PageRequest.of(criteria.getPage(), criteria.getSize(), Sort.by(validatedSortBy));

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
        List<RestaurantDTO> mergedResults = mergeAndSortResults(dbResults, apiResults);
        log.info("Merged and sorted results: {}", mergedResults);

        // Create a pageable response
        Page<RestaurantDTO> page = new PageImpl<>(mergedResults, pageable, mergedResults.size());
        log.info("Final pageable response created: {}", page);

        // Return the response
        return new PagedResponse<>(page);
    }

    private String validateSortBy(String sortBy) {
        if (VALID_SORT_FIELDS.contains(sortBy)) {
            return sortBy;
        }
        log.warn("Invalid sortBy value: {}. Defaulting to 'rating'.", sortBy);
        return "rating"; // Default to 'rating' if sortBy is invalid
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
                Predicate cuisinePredicate = cb.disjunction();
                for (String cuisine : criteria.getCuisines()) {
                    cuisinePredicate = cb.or(cuisinePredicate,
                            cb.like(cb.lower(root.get("details").get("cuisineType")), "%" + cuisine.toLowerCase() + "%"));
                }
                predicates.add(cuisinePredicate);
            }

            if (criteria.getPriceRange() != null) {
                log.info("priceRange {}",criteria.getPriceRange());
                log.info("priceRange value {}",criteria.getPriceRange());

                predicates.add(cb.equal(root.get("priceLevel"), criteria.getPriceRange()));
            }

            if (criteria.getMinRating() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("rating"), criteria.getMinRating()));
            }

            if (criteria.getZipcode() != null && !criteria.getZipcode().isEmpty()) {
                predicates.add(cb.equal(root.get("zipcode"), criteria.getZipcode()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
