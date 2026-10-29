package com.codealpha.hotelreservation.controller;

import com.codealpha.hotelreservation.dto.ApiResponse;
import com.codealpha.hotelreservation.dto.AuthRequests;
import com.codealpha.hotelreservation.dto.AuthResponse;
import com.codealpha.hotelreservation.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody AuthRequests.LoginRequest request, HttpServletRequest httpRequest) {
        AuthResponse response = authService.login(request, httpRequest);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody AuthRequests.RegisterRequest request, HttpServletRequest httpRequest) {
        AuthResponse response = authService.register(request, httpRequest);
        return ResponseEntity.ok(ApiResponse.ok("Registration successful", response));
    }

    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse<Map<String, Object>>> sendOtp(@Valid @RequestBody AuthRequests.OtpRequest request) {
        Map<String, Object> result = authService.sendOtp(request.getPhoneNumber());
        return ResponseEntity.ok(ApiResponse.ok("Verification code dispatched", result));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<AuthResponse>> verifyOtp(@Valid @RequestBody AuthRequests.OtpVerifyRequest request, HttpServletRequest httpRequest) {
        AuthResponse response = authService.verifyOtp(request, httpRequest);
        return ResponseEntity.ok(ApiResponse.ok("Mobile authentication verified", response));
    }

    @PostMapping("/demo-login")
    public ResponseEntity<ApiResponse<AuthResponse>> demoLogin(@RequestBody(required = false) AuthRequests.DemoLoginRequest request, HttpServletRequest httpRequest) {
        String role = (request != null && request.getRole() != null) ? request.getRole() : "USER";
        AuthResponse response = authService.demoLogin(role, httpRequest);
        return ResponseEntity.ok(ApiResponse.ok("Demo login authorized", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthResponse>> getCurrentUser() {
        AuthResponse response = authService.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}

