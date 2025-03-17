package org.annp.checkorder.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.Nationalized;

import java.time.Instant;

@Entity
@Table(name = "promotion")
public class Promotion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "discount")
    private Integer discount;

    @Column(name = "begin_date")
    private Instant beginDate;

    @Column(name = "end_date")
    private Instant endDate;

    @Column(name = "code", length = 50)
    private String code;

    @Nationalized
    @Column(name = "note", length = 250)
    private String note;

    @Column(name = "type")
    private Integer type;

    @Column(name = "quantity")
    private Integer quantity;

    @Nationalized
    @Column(name = "img", length = 500)
    private String img;

    @Column(name = "level_vip")
    private Integer levelVip;

    @Column(name = "percentpage")
    private Float percentpage;

    @Column(name = "created_date")
    private Instant createdDate;

    public Promotion() {
    }

    public Promotion(Integer id, Integer discount, Instant beginDate, Instant endDate, String code, String note, Integer type, Integer quantity, String img, Integer levelVip, Float percentpage, Instant createdDate) {
        this.id = id;
        this.discount = discount;
        this.beginDate = beginDate;
        this.endDate = endDate;
        this.code = code;
        this.note = note;
        this.type = type;
        this.quantity = quantity;
        this.img = img;
        this.levelVip = levelVip;
        this.percentpage = percentpage;
        this.createdDate = createdDate;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getDiscount() {
        return discount;
    }

    public void setDiscount(Integer discount) {
        this.discount = discount;
    }

    public Instant getBeginDate() {
        return beginDate;
    }

    public void setBeginDate(Instant beginDate) {
        this.beginDate = beginDate;
    }

    public Instant getEndDate() {
        return endDate;
    }

    public void setEndDate(Instant endDate) {
        this.endDate = endDate;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getImg() {
        return img;
    }

    public void setImg(String img) {
        this.img = img;
    }

    public Integer getLevelVip() {
        return levelVip;
    }

    public void setLevelVip(Integer levelVip) {
        this.levelVip = levelVip;
    }

    public Float getPercentpage() {
        return percentpage;
    }

    public void setPercentpage(Float percentpage) {
        this.percentpage = percentpage;
    }

    public Instant getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Instant createdDate) {
        this.createdDate = createdDate;
    }

}