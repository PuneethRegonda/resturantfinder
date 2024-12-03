package com.opensource.resturantfinder;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.opensource.resturantfinder.model.OperatingHoursDTO;
import com.opensource.resturantfinder.model.PagedResponse;
import com.opensource.resturantfinder.model.RestaurantDTO;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.time.LocalTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class SerializationTest {

    @Test
    void testSerialization() throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        RestaurantDTO dto = new RestaurantDTO();
        OperatingHoursDTO op = new OperatingHoursDTO();
        op.setId(1L);
        op.setDayOfWeek(1);
        op.setOpenTime(LocalTime.of(9, 0));
        op.setCloseTime(LocalTime.of(17, 30));

        dto.setOperatingHours(List.of(op));

        Page<RestaurantDTO> page = new PageImpl<>(List.of(dto), PageRequest.of(0, 10), 1);
        PagedResponse<RestaurantDTO> response = new PagedResponse<>(page);

        String json = objectMapper.writeValueAsString(response);
        System.out.println(json);

        assertTrue(json.contains("\"openTime\":\"09:00\""));
        assertTrue(json.contains("\"closeTime\":\"17:30\""));
    }
}
