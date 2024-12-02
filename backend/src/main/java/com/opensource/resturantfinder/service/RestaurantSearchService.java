package com.opensource.resturantfinder.service;

import com.opensource.resturantfinder.entity.Restaurant;
import com.opensource.resturantfinder.model.RestaurantDTO;
import com.opensource.resturantfinder.model.RestaurantDetailsDTO;
import com.opensource.resturantfinder.model.SearchCriteria;
import com.opensource.resturantfinder.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.locationtech.jts.geom.Point;

import java.util.ArrayList;
import java.util.List;

@Service
public class RestaurantSearchService {

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Cacheable(value = "restaurantSearchCache", key = "#criteria.toString()")
    public Page<RestaurantDTO> searchRestaurants(SearchCriteria criteria) {
        Specification<Restaurant> spec = buildSpecification(criteria);
        Pageable pageable = PageRequest.of(criteria.getPage(), criteria.getSize(), Sort.by(criteria.getSortBy()));
        
        Page<Restaurant> restaurantPage = restaurantRepository.findAll(spec, pageable);
        return restaurantPage.map(this::convertToDTO);
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

    private RestaurantDTO convertToDTO(Restaurant restaurant) {
        RestaurantDTO dto = new RestaurantDTO();
        dto.setId(restaurant.getId());
        dto.setName(restaurant.getName());
        dto.setBusinessStatus(restaurant.getBusinessStatus());
        dto.setLatitude(restaurant.getLatitude());
        dto.setLongitude(restaurant.getLongitude());
        dto.setIconUrl(restaurant.getIconUrl());
        dto.setPriceLevel(restaurant.getPriceLevel()); // This now sets a PriceRange enum
        dto.setRating(restaurant.getRating());
        dto.setUserRatingsTotal(restaurant.getUserRatingsTotal());
        dto.setVicinity(restaurant.getVicinity());

        if (restaurant.getDetails() != null) {
            RestaurantDetailsDTO detailsDTO = new RestaurantDetailsDTO();
            detailsDTO.setDescription(restaurant.getDetails().getDescription());
            detailsDTO.setPhoneNumber(restaurant.getDetails().getPhoneNumber());
            detailsDTO.setWebsite(restaurant.getDetails().getWebsite());
            detailsDTO.setCuisineType(restaurant.getDetails().getCuisineType());
            detailsDTO.setIsVegetarian(restaurant.getDetails().getIsVegetarian());
            detailsDTO.setIsVegan(restaurant.getDetails().getIsVegan());
            dto.setDetails(detailsDTO);
        }

        return dto;
    }


}