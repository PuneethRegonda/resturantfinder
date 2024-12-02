package com.opensource.resturantfinder.model;

public enum PriceRange {
    UNKNOWN(0),
    LOW(1),
    MEDIUM(2),
    HIGH(3),
    VERY_HIGH(4);

    private final int value;

    PriceRange(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    public static PriceRange fromValue(int value) {
        for (PriceRange range : values()) {
            if (range.value == value) {
                return range;
            }
        }
        return UNKNOWN; // Default to UNKNOWN for unrecognized values
    }
}