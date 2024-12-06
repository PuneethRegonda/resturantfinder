package com.opensource.resturantfinder.model;

public class GoogleAuthRequest {
    private String code;

    public GoogleAuthRequest() {}

    public GoogleAuthRequest(String code) {
        this.code = code;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}

