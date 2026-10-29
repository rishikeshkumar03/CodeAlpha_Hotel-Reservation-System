package com.codealpha.hotelreservation.dto;

public class AuthResponse {
    private boolean authenticated;
    private Long userId;
    private String email;
    private String fullName;
    private String role;
    private String phoneNumber;
    private String authProvider;
    private String token;
    private String message;

    public AuthResponse() {}

    public AuthResponse(boolean authenticated, Long userId, String email, String fullName, String role, String phoneNumber, String authProvider, String message) {
        this.authenticated = authenticated;
        this.userId = userId;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.phoneNumber = phoneNumber;
        this.authProvider = authProvider;
        this.message = message;
    }

    public boolean isAuthenticated() { return authenticated; }
    public void setAuthenticated(boolean authenticated) { this.authenticated = authenticated; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getAuthProvider() { return authProvider; }
    public void setAuthProvider(String authProvider) { this.authProvider = authProvider; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}

