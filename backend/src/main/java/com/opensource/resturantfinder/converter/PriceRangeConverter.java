package com.opensource.resturantfinder.converter;

import com.opensource.resturantfinder.model.PriceRange;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class PriceRangeConverter implements AttributeConverter<PriceRange, String> {
    @Override
    public String convertToDatabaseColumn(PriceRange attribute) {
        return attribute == null ? null : String.valueOf(attribute.getValue());
    }

    @Override
    public PriceRange convertToEntityAttribute(String dbData) {
        return dbData == null ? null : PriceRange.fromValue(Integer.parseInt(dbData));
    }
}

