package com.opensource.resturantfinder.model;

import java.util.List;

public class MapsApiResponse {
    private List<MapsApiRestaurant> results;
    private int totalResults;

    public List<MapsApiRestaurant> getResults() {
        return results;
    }

    public void setResults(List<MapsApiRestaurant> results) {
        this.results = results;
    }

    public int getTotalResults() {
        return totalResults;
    }

    public void setTotalResults(int totalResults) {
        this.totalResults = totalResults;
    }
}