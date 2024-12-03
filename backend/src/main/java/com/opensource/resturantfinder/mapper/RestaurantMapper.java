package com.opensource.resturantfinder.mapper;

import com.opensource.resturantfinder.entity.Restaurant;
import com.opensource.resturantfinder.model.PriceRange;
import com.opensource.resturantfinder.model.RestaurantDTO;
import com.opensource.resturantfinder.model.MapsApiRestaurant;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
@Mapper(componentModel = "spring")
public interface RestaurantMapper {

    RestaurantDTO toDto(Restaurant restaurant);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "details", ignore = true)
    RestaurantDTO toDto(MapsApiRestaurant mapsApiRestaurant);

    // Add this method
    default PriceRange mapPriceLevel(Integer priceLevel) {
        if (priceLevel == null) return null;
        switch (priceLevel) {
            case 1: return PriceRange.LOW;
            case 2: return PriceRange.MEDIUM;
            case 3: return PriceRange.HIGH;
            case 4: return PriceRange.VERY_HIGH;
            default: return PriceRange.UNKNOWN;
        }
    }
}