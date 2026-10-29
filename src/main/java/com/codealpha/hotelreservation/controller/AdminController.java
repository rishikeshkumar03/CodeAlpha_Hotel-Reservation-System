package com.codealpha.hotelreservation.controller;

import com.codealpha.hotelreservation.dto.ApiResponse;
import com.codealpha.hotelreservation.dto.ResponseDtos;
import com.codealpha.hotelreservation.dto.SearchAndBookingRequests;
import com.codealpha.hotelreservation.entity.AuditLog;
import com.codealpha.hotelreservation.entity.Cancellation;
import com.codealpha.hotelreservation.entity.Payment;
import com.codealpha.hotelreservation.entity.Room;
import com.codealpha.hotelreservation.entity.RoomType;
import com.codealpha.hotelreservation.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<ResponseDtos.AdminDashboardDto>> getDashboard() {
        ResponseDtos.AdminDashboardDto stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.ok("Admin dashboard metrics", stats));
    }

    @GetMapping("/reservations")
    public ResponseEntity<ApiResponse<List<ResponseDtos.ReservationDto>>> getAllReservations(
            @RequestParam(required = false) String query) {
        List<ResponseDtos.ReservationDto> list = adminService.getAllReservations(query);
        return ResponseEntity.ok(ApiResponse.ok("Reservations retrieved", list));
    }

    @GetMapping("/payments")
    public ResponseEntity<ApiResponse<List<Payment>>> getAllPayments() {
        return ResponseEntity.ok(ApiResponse.ok("Payment records retrieved", adminService.getAllPayments()));
    }

    @GetMapping("/cancellations")
    public ResponseEntity<ApiResponse<List<Cancellation>>> getAllCancellations() {
        return ResponseEntity.ok(ApiResponse.ok("Cancellation records retrieved", adminService.getAllCancellations()));
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<ApiResponse<List<AuditLog>>> getAuditLogs() {
        return ResponseEntity.ok(ApiResponse.ok("System audit trail", adminService.getRecentAuditLogs()));
    }

    @GetMapping("/rooms")
    public ResponseEntity<ApiResponse<List<Room>>> getAllRooms() {
        return ResponseEntity.ok(ApiResponse.ok("Room inventory", adminService.getAllRooms()));
    }

    @PostMapping("/rooms")
    public ResponseEntity<ApiResponse<Room>> createOrUpdateRoom(@Valid @RequestBody SearchAndBookingRequests.RoomAdminRequest req) {
        Room room = adminService.createOrUpdateRoom(req);
        return ResponseEntity.ok(ApiResponse.ok("Room inventory updated", room));
    }

    @PostMapping("/room-types/{id}/price")
    public ResponseEntity<ApiResponse<RoomType>> updatePrice(
            @PathVariable Long id,
            @RequestBody Map<String, BigDecimal> body) {
        BigDecimal newPrice = body.get("basePricePerNight");
        if (newPrice == null || newPrice.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valid price is required");
        }
        RoomType updated = adminService.updateRoomTypePrice(id, newPrice);
        return ResponseEntity.ok(ApiResponse.ok("Room price updated", updated));
    }
}

