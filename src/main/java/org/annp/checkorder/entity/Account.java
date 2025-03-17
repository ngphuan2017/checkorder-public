package org.annp.checkorder.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "account")
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "username", nullable = false, length = 25)
    private String username;

    @Column(name = "password", nullable = false, length = 25)
    private String password;

    @Column(name = "code_2fa", length = 32)
    private String code2fa;

    @Column(name = "end_date")
    private Instant endDate;

    public Account() {
    }

    public Account(Integer id, String username, String password, String code2fa, Instant endDate) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.code2fa = code2fa;
        this.endDate = endDate;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getCode2fa() {
        return code2fa;
    }

    public void setCode2fa(String code2fa) {
        this.code2fa = code2fa;
    }

    public Instant getEndDate() {
        return endDate;
    }

    public void setEndDate(Instant endDate) {
        this.endDate = endDate;
    }

}