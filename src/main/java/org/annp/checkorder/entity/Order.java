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
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "name", nullable = false, length = 20)
    private String name;

    @Column(name = "paid_date")
    private Instant paidDate;

    @Column(name = "end_date")
    private Instant endDate;

    @Column(name = "secret_key", nullable = false, length = 32)
    private String secretKey;

    @Column(name = "account_id")
    private Integer accountId;

    @Column(name = "status", nullable = false)
    private Integer status;

    @Column(name = "sum_2fa")
    private Integer sum2fa;

    @Column(name = "update_date")
    private Instant updateDate;

    @Column(name = "updated_by", nullable = false)
    private Integer updatedBy;

    @Column(name = "amount")
    private Integer amount;

    @Column(name = "discount")
    private Integer discount;

    @Column(name = "user_id")
    private Integer userId;

    @Nationalized
    @Column(name = "note", length = 150)
    private String note;

    @Column(name = "type")
    private Integer type;

    @Column(name = "created_date")
    private Instant createdDate;

    @Column(name = "shipped_date")
    private Instant shippedDate;

    public Order() {
    }

    public Order(Integer id, String name, Instant paidDate, Instant endDate, String secretKey, Integer accountId, Integer status, Integer sum2fa, Instant updateDate, Integer updatedBy, Integer amount, Integer discount, Integer userId, String note, Integer type, Instant createdDate, Instant shippedDate) {
        this.id = id;
        this.name = name;
        this.paidDate = paidDate;
        this.endDate = endDate;
        this.secretKey = secretKey;
        this.accountId = accountId;
        this.status = status;
        this.sum2fa = sum2fa;
        this.updateDate = updateDate;
        this.updatedBy = updatedBy;
        this.amount = amount;
        this.discount = discount;
        this.userId = userId;
        this.note = note;
        this.type = type;
        this.createdDate = createdDate;
        this.shippedDate = shippedDate;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Instant getPaidDate() {
        return paidDate;
    }

    public void setPaidDate(Instant paidDate) {
        this.paidDate = paidDate;
    }

    public Instant getEndDate() {
        return endDate;
    }

    public void setEndDate(Instant endDate) {
        this.endDate = endDate;
    }

    public String getSecretKey() {
        return secretKey;
    }

    public void setSecretKey(String secretKey) {
        this.secretKey = secretKey;
    }

    public Integer getAccountId() {
        return accountId;
    }

    public void setAccountId(Integer accountId) {
        this.accountId = accountId;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Integer getSum2fa() {
        return sum2fa;
    }

    public void setSum2fa(Integer sum2fa) {
        this.sum2fa = sum2fa;
    }

    public Instant getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(Instant updateDate) {
        this.updateDate = updateDate;
    }

    public Integer getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(Integer updatedBy) {
        this.updatedBy = updatedBy;
    }

    public Integer getAmount() {
        return amount;
    }

    public void setAmount(Integer amount) {
        this.amount = amount;
    }

    public Integer getDiscount() {
        return discount;
    }

    public void setDiscount(Integer discount) {
        this.discount = discount;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
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

    public Instant getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Instant createdDate) {
        this.createdDate = createdDate;
    }

    public Instant getShippedDate() {
        return shippedDate;
    }

    public void setShippedDate(Instant shippedDate) {
        this.shippedDate = shippedDate;
    }

}