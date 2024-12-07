package com.opensource.resturantfinder.mapper;

import com.opensource.resturantfinder.entity.Restaurant;
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

}