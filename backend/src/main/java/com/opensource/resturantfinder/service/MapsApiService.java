package com.opensource.resturantfinder.service;

import com.opensource.resturantfinder.model.PriceRange;
import com.opensource.resturantfinder.model.RestaurantDTO;
import com.opensource.resturantfinder.model.SearchCriteria;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class MapsApiService {

    @Value("${maps.api.key}")
    private String apiKey;

    @Value("${maps.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate;

    public MapsApiService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Cacheable(value = "mapsApiCache", key = "#criteria.toString()")
    public List<RestaurantDTO> searchPlaces(SearchCriteria criteria) {
        String url = buildApiUrl(criteria);
        MapsApiResponse response = restTemplate.getForObject(url, MapsApiResponse.class);

        return convertToRestaurantDTOs(response);
    }


    private String buildApiUrl(SearchCriteria criteria) {
        StringBuilder urlBuilder = new StringBuilder(apiUrl);
        urlBuilder.append("?key=").append(apiKey);
        urlBuilder.append("&location=").append(criteria.getLatitude()).append(",").append(criteria.getLongitude());
        urlBuilder.append("&radius=").append(criteria.getRadius());
        urlBuilder.append("&type=restaurant");

        if (criteria.getName() != null) {
            urlBuilder.append("&keyword=").append(criteria.getName());
        }
        if (criteria.getMinRating() != null) {
            urlBuilder.append("&minrating=").append(criteria.getMinRating());
        }
        // Add more parameters as needed

        return urlBuilder.toString();
    }

    private List<RestaurantDTO> convertToRestaurantDTOs(MapsApiResponse response) {
        List<RestaurantDTO> restaurants = new ArrayList<>();
        for (MapsApiResponse.Result result : response.getResults()) {
            RestaurantDTO dto = new RestaurantDTO();
            dto.setName(result.getName());
            dto.setLatitude(result.getGeometry().getLocation().getLat());
            dto.setLongitude(result.getGeometry().getLocation().getLng());
            dto.setRating(result.getRating());
            dto.setPriceLevel(convertPriceLevel(result.getPriceLevel()));
            // Set other fields as needed
            restaurants.add(dto);
        }
        return restaurants;
    }

    private PriceRange convertPriceLevel(Integer apiPriceLevel) {
        if (apiPriceLevel == null) return null;
        switch (apiPriceLevel) {
            case 1: return PriceRange.LOW;
            case 2: return PriceRange.MEDIUM;
            case 3: return PriceRange.HIGH;
            case 4: return PriceRange.VERY_HIGH;
            default: return null;
        }
    }

    private static class MapsApiResponse {
        private List<Result> results;
        private int totalResults;

        public List<Result> getResults() {
            return results;
        }

        public void setResults(List<Result> results) {
            this.results = results;
        }

        public int getTotalResults() {
            return totalResults;
        }

        public void setTotalResults(int totalResults) {
            this.totalResults = totalResults;
        }

        public static class Result {
            private String name;
            private Geometry geometry;
            private Double rating;
            private Integer priceLevel;

            public String getName() {
                return name;
            }

            public void setName(String name) {
                this.name = name;
            }

            public Geometry getGeometry() {
                return geometry;
            }

            public void setGeometry(Geometry geometry) {
                this.geometry = geometry;
            }

            public Double getRating() {
                return rating;
            }

            public void setRating(Double rating) {
                this.rating = rating;
            }

            public Integer getPriceLevel() {
                return priceLevel;
            }

            public void setPriceLevel(Integer priceLevel) {
                this.priceLevel = priceLevel;
            }
        }

        public static class Geometry {
            private Location location;

            public Location getLocation() {
                return location;
            }

            public void setLocation(Location location) {
                this.location = location;
            }
        }

        public static class Location {
            private Double lat;
            private Double lng;

            public Double getLat() {
                return lat;
            }

            public void setLat(Double lat) {
                this.lat = lat;
            }

            public Double getLng() {
                return lng;
            }

            public void setLng(Double lng) {
                this.lng = lng;
            }
        }
    }
}