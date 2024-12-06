package com.opensource.resturantfinder.model;

public class DuplicateFlagResponse {
    private Long restaurantId;
    private String name;
    private String vicinity;
    private String flagReason;

    private DuplicateFlagResponse(Builder builder) {
        this.restaurantId = builder.restaurantId;
        this.name = builder.name;
        this.vicinity = builder.vicinity;
        this.flagReason = builder.flagReason;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long restaurantId;
        private String name;
        private String vicinity;
        private String flagReason;

        public Builder restaurantId(Long restaurantId) {
            this.restaurantId = restaurantId;
            return this;
        }

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public Builder vicinity(String vicinity) {
            this.vicinity = vicinity;
            return this;
        }

        public Builder flagReason(String flagReason) {
            this.flagReason = flagReason;
            return this;
        }

        public DuplicateFlagResponse build() {
            return new DuplicateFlagResponse(this);
        }
    }

    // Getters
    public Long getRestaurantId() {
        return restaurantId;
    }

    public String getName() {
        return name;
    }

    public String getVicinity() {
        return vicinity;
    }

    public String getFlagReason() {
        return flagReason;
    }
}
