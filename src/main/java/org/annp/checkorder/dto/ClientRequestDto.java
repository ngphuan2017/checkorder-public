package org.annp.checkorder.dto;

public class ClientRequestDto {

    private String token;
    private String cookie;

    public ClientRequestDto() {
    }

    public ClientRequestDto(String token, String cookie) {
        this.token = token;
        this.cookie = cookie;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getCookie() {
        return cookie;
    }

    public void setCookie(String cookie) {
        this.cookie = cookie;
    }
}
