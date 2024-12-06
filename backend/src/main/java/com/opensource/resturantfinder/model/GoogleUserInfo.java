package com.opensource.resturantfinder.model;

public class GoogleUserInfo {
    private String id;
    private String email;
    private String name;

    public GoogleUserInfo(String id, String email, String name) {
        this.id = id;
        this.email = email;
        this.name = name;
    }

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}