package com.opensource.resturantfinder;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.opensource.resturantfinder.model.OperatingHoursDTO;
import org.junit.jupiter.api.Test;
import java.time.LocalTime;
import static org.junit.jupiter.api.Assertions.*;

class ObjectMapperTest {

    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

    @Test
    void testLocalTimeSerialization() throws Exception {
        OperatingHoursDTO dto = new OperatingHoursDTO();
        dto.setOpenTime(LocalTime.of(9, 0));
        dto.setCloseTime(LocalTime.of(17, 30));

        String json = objectMapper.writeValueAsString(dto);
        OperatingHoursDTO deserializedDto = objectMapper.readValue(json, OperatingHoursDTO.class);

        assertEquals(dto.getOpenTime(), deserializedDto.getOpenTime());
        assertEquals(dto.getCloseTime(), deserializedDto.getCloseTime());
    }


    @Test
    void testOperatingHoursSerialization() throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        OperatingHoursDTO dto = new OperatingHoursDTO();
        dto.setOpenTime(LocalTime.of(9, 0));
        dto.setCloseTime(LocalTime.of(17, 30));

        String json = objectMapper.writeValueAsString(dto);
        System.out.println(json);

        assertTrue(json.contains("\"openTime\":\"09:00\""));
        assertTrue(json.contains("\"closeTime\":\"17:30\""));
    }


}
