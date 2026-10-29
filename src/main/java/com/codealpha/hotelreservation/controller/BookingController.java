package com.codealpha.hotelreservation.controller;

import com.codealpha.hotelreservation.dto.ApiResponse;
import com.codealpha.hotelreservation.dto.ResponseDtos;
import com.codealpha.hotelreservation.dto.SearchAndBookingRequests;
import com.codealpha.hotelreservation.service.BookingService;
import com.codealpha.hotelreservation.service.CancellationService;
import com.codealpha.hotelreservation.service.RoomService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;
    private final CancellationService cancellationService;
    private final RoomService roomService;

    public BookingController(BookingService bookingService, CancellationService cancellationService, RoomService roomService) {
        this.bookingService = bookingService;
        this.cancellationService = cancellationService;
        this.roomService = roomService;
    }

    @PostMapping("/quote")
    public ResponseEntity<ApiResponse<ResponseDtos.PriceBreakdownDto>> getPriceQuote(
            @Valid @RequestBody SearchAndBookingRequests.PriceQuoteRequest request) {
        ResponseDtos.PriceBreakdownDto quote = roomService.getPriceQuote(request);
        return ResponseEntity.ok(ApiResponse.ok("Price breakdown calculated", quote));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ResponseDtos.BookingResponseDto>> createReservation(
            @Valid @RequestBody SearchAndBookingRequests.BookingRequest request,
            HttpServletRequest httpRequest) {
        ResponseDtos.BookingResponseDto booking = bookingService.createReservation(request, httpRequest);
        return ResponseEntity.ok(ApiResponse.ok("Reservation successfully confirmed", booking));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ResponseDtos.ReservationDto>>> getUserReservations() {
        List<ResponseDtos.ReservationDto> list = bookingService.getUserReservations();
        return ResponseEntity.ok(ApiResponse.ok("User reservations retrieved", list));
    }

    @GetMapping("/{bookingReference}")
    public ResponseEntity<ApiResponse<ResponseDtos.ReservationDto>> getReservationByReference(
            @PathVariable String bookingReference) {
        ResponseDtos.ReservationDto reservation = bookingService.getReservationByReference(bookingReference);
        return ResponseEntity.ok(ApiResponse.ok("Reservation details retrieved", reservation));
    }

    @PostMapping("/{bookingReference}/cancel")
    public ResponseEntity<ApiResponse<ResponseDtos.CancellationResponseDto>> cancelReservation(
            @PathVariable String bookingReference,
            @RequestBody(required = false) SearchAndBookingRequests.CancellationRequest request) {
        String reason = (request != null && request.getReason() != null) ? request.getReason() : "Cancelled by user";
        ResponseDtos.CancellationResponseDto cancellation = cancellationService.cancelReservation(bookingReference, reason);
        return ResponseEntity.ok(ApiResponse.ok("Reservation cancelled", cancellation));
    }
}

