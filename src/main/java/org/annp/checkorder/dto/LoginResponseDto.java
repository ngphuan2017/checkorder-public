package org.annp.checkorder.dto;

public class LoginResponseDto {
    private String token;
    private Integer id;
    private String fullname;
    private Integer role;
    private Integer expire;

    public LoginResponseDto() {
    }

    public LoginResponseDto(String token, Integer id, String fullname, Integer role, Integer expire) {
        this.token = token;
        this.id = id;
        this.fullname = fullname;
        this.role = role;
        this.expire = expire;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public Integer getRole() {
        return role;
    }

    public void setRole(Integer role) {
        this.role = role;
    }

    public Integer getExpire() {
        return expire;
    }

    public void setExpire(Integer expire) {
        this.expire = expire;
    }
}
