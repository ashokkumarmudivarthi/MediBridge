package com.medibridge.authservice.dto;

public class LoginResponse {
    private String message;
    private String token;
    private String refreshToken;
    private String role;

    public LoginResponse(String message, String token, String refreshToken, String role) {
        this.message = message;
        this.token = token;
        this.refreshToken = refreshToken;
        this.role = role;
    }

    public String getMessage() {
        return message;
    }

    public String getToken() {
        return token;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public String getRole() {
        return role;
    }
}
