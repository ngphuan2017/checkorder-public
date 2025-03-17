package org.annp.checkorder.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.Nationalized;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "category_sub_id")
    private Integer categorySubId;

    @Nationalized
    @Column(name = "name", length = 100)
    private String name;

    @Nationalized
    @Column(name = "description", length = 250)
    private String description;

    @Column(name = "price")
    private Integer price;

    @Nationalized
    @Column(name = "image", length = 500)
    private String image;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "discount")
    private Integer discount;

    @Column(name = "status")
    private Integer status;

    @Column(name = "review_count")
    private Integer reviewCount;

    @Column(name = "average_rating", precision = 10, scale = 9)
    private BigDecimal averageRating;

    @Column(name = "units_sold")
    private Integer unitsSold;

    @Column(name = "created_date")
    private Instant createdDate;

    @Column(name = "updated_date")
    private Instant updatedDate;

    public Product() {
    }

    public Product(Integer id, Integer categorySubId, String name, String description, Integer price, String image, Integer quantity, Integer discount, Integer status, Integer reviewCount, BigDecimal averageRating, Integer unitsSold, Instant createdDate, Instant updatedDate) {
        this.id = id;
        this.categorySubId = categorySubId;
        this.name = name;
        this.description = description;
        this.price = price;
        this.image = image;
        this.quantity = quantity;
        this.discount = discount;
        this.status = status;
        this.reviewCount = reviewCount;
        this.averageRating = averageRating;
        this.unitsSold = unitsSold;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getCategorySubId() {
        return categorySubId;
    }

    public void setCategorySubId(Integer categorySubId) {
        this.categorySubId = categorySubId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Integer getDiscount() {
        return discount;
    }

    public void setDiscount(Integer discount) {
        this.discount = discount;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Integer getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(Integer reviewCount) {
        this.reviewCount = reviewCount;
    }

    public BigDecimal getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(BigDecimal averageRating) {
        this.averageRating = averageRating;
    }

    public Integer getUnitsSold() {
        return unitsSold;
    }

    public void setUnitsSold(Integer unitsSold) {
        this.unitsSold = unitsSold;
    }

    public Instant getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Instant createdDate) {
        this.createdDate = createdDate;
    }

    public Instant getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(Instant updatedDate) {
        this.updatedDate = updatedDate;
    }

}