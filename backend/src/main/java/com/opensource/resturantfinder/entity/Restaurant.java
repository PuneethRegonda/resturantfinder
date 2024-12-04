package com.opensource.resturantfinder.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.opensource.resturantfinder.converter.PriceRangeConverter;
import com.opensource.resturantfinder.model.PriceRange;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "restaurants")
public class Restaurant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String businessStatus;
    private Double latitude;
    private Double longitude;
    private String iconUrl;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;


    @Convert(converter = PriceRangeConverter.class)
    @Column(name = "price_level")
    private PriceRange priceLevel;

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    private Double rating;
    private Integer userRatingsTotal;
    private String vicinity;

    @OneToOne(mappedBy = "restaurant", cascade = CascadeType.ALL)
    private RestaurantDetails details;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "restaurant")
    private List<OperatingHours> operatingHours = new ArrayList<>();

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "restaurant_categories",
            joinColumns = @JoinColumn(name = "restaurant_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    @JsonManagedReference
    private Set<Category> categories = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBusinessStatus() {
        return businessStatus;
    }

    public void setBusinessStatus(String businessStatus) {
        this.businessStatus = businessStatus;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getIconUrl() {
        return iconUrl;
    }

    public void setIconUrl(String iconUrl) {
        this.iconUrl = iconUrl;
    }

    public PriceRange getPriceLevel() {
        return priceLevel;
    }

    public void setPriceLevel(PriceRange priceLevel) {
        this.priceLevel = priceLevel;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Integer getUserRatingsTotal() {
        return userRatingsTotal;
    }

    public void setUserRatingsTotal(Integer userRatingsTotal) {
        this.userRatingsTotal = userRatingsTotal;
    }

    public String getVicinity() {
        return vicinity;
    }

    public void setVicinity(String vicinity) {
        this.vicinity = vicinity;
    }

    public RestaurantDetails getDetails() {
        return details;
    }

    public void setDetails(RestaurantDetails details) {
        this.details = details;
    }

    public List<OperatingHours> getOperatingHours() {
        return operatingHours;
    }

    public void setOperatingHours(List<OperatingHours> operatingHours) {
        this.operatingHours = operatingHours;
    }

    public Set<Category> getCategories() {
        return categories;
    }

    public void setCategories(Set<Category> categories) {
        this.categories = categories;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public String toString() {
        return "Restaurant{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", businessStatus='" + businessStatus + '\'' +
                ", latitude=" + latitude +
                ", longitude=" + longitude +
                ", iconUrl='" + iconUrl + '\'' +
                ", owner=" + owner +
                ", priceLevel=" + priceLevel +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", rating=" + rating +
                ", userRatingsTotal=" + userRatingsTotal +
                ", vicinity='" + vicinity + '\'' +
                ", details=" + details +
                ", operatingHours=" + operatingHours +
                ", categories=" + categories +
                '}';
    }
}
