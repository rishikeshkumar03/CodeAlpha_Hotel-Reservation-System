package com.codealpha.hotelreservation.controller;

import com.codealpha.hotelreservation.dto.ApiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/policy")
public class PolicyController {

    @Value("${app.policy.version:v2026.1}")
    private String policyVersion;

    @GetMapping("/terms")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getTermsAndConditions() {
        Map<String, Object> policy = new HashMap<>();
        policy.put("version", policyVersion);
        policy.put("title", "CodeAlpha Hospitality Terms and Conditions");
        policy.put("lastUpdated", "October 2026");
        policy.put("sections", Map.of(
            "reservationAccuracy", "Guests are solely responsible for verifying reservation dates, hotel destination, selected room category, guest count, and contact details prior to final booking confirmation.",
            "availability", "Availability is confirmed in real-time by the CodeAlpha transactional engine only upon successful payment authorization.",
            "pricingAndTaxes", "Room rates are displayed per night based on selected occupancy. Sample hospitality taxes (12%) and resort service fees ($25.00/room) are clearly enumerated. All monetary figures are server-verified.",
            "simulatedPaymentDisclosure", "IMPORTANT NOTICE: CodeAlpha Hotel Reservation System operates with SIMULATED PAYMENTS in development and demonstration mode. No real financial credentials, debit/credit cards, UPI PINs, or actual monetary charges occur.",
            "cancellationAndRefunds", "Standard reservations may be cancelled free of charge up to 48 hours prior to the check-in date for a 100% simulated refund of room charges and taxes. Cancellations within 48 hours receive a 50% simulated refund. No refund applies after check-in date.",
            "changesAndNoShows", "Check-in time begins at 15:00 local hotel time; check-out is required by 11:00. Unclaimed rooms after 23:59 on the scheduled arrival date will be classified as a no-show.",
            "accountSecurity", "Users are responsible for maintaining the confidentiality of their credentials and one-time verification tokens.",
            "serviceLimitations", "Hotels, room imagery, and rates are demonstration assets for CodeAlpha Hospitality Platform development."
        ));
        return ResponseEntity.ok(ApiResponse.ok("Terms and conditions retrieved", policy));
    }

    @GetMapping("/privacy")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPrivacyPolicy() {
        Map<String, Object> privacy = new HashMap<>();
        privacy.put("version", policyVersion);
        privacy.put("title", "CodeAlpha Hospitality Privacy & Data Protection Notice");
        privacy.put("dataCollected", "Full name, contact email address, mobile number, and booking preferences.");
        privacy.put("purpose", "Reservation management, guest communication, booking verification, and audit logging.");
        privacy.put("storage", "Secure persistent relational database with BCrypt password hashing and role-based access controls.");
        privacy.put("retention", "Data is retained during active account status. Users may request deletion through the contact portal.");
        privacy.put("contact", "support@codealpha.hospitality.demo");
        return ResponseEntity.ok(ApiResponse.ok("Privacy policy retrieved", privacy));
    }
}

