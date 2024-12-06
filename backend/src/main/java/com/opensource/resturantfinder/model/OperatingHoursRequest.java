package com.opensource.resturantfinder.model;

import java.time.LocalTime;

public class OperatingHoursRequest {
    private Integer dayOfWeek;
    private LocalTime openTime;
    private LocalTime closeTime;

    // Getters and setters


    public Integer getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(Integer dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }

    public LocalTime getOpenTime() {
        return openTime;
    }

    public void setOpenTime(LocalTime openTime) {
        this.openTime = openTime;
    }

    public LocalTime getCloseTime() {
        return closeTime;
    }

    public void setCloseTime(LocalTime closeTime) {
        this.closeTime = closeTime;
    }
}