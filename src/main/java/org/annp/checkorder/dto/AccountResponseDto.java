package org.annp.checkorder.dto;

import org.annp.checkorder.entity.Account;

import java.time.Instant;

public class AccountResponseDto {
    private Integer id;
    private String username;
    private String password;
    private Instant endDate;

    public AccountResponseDto() {
    }

    public AccountResponseDto(Integer id, String username, String password, Instant endDate) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.endDate = endDate;
    }

    public AccountResponseDto(Account account) {
        this.id = account.getId();
        this.username = account.getUsername();
        this.password = account.getPassword();
        this.endDate = account.getEndDate();
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

    public Instant getEndDate() {
        return endDate;
    }

    public void setEndDate(Instant endDate) {
        this.endDate = endDate;
    }
}
