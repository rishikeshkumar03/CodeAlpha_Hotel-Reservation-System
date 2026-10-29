package com.codealpha.hotelreservation.controller;

import com.codealpha.hotelreservation.dto.ApiResponse;
import com.codealpha.hotelreservation.entity.Hotel;
import com.codealpha.hotelreservation.service.HotelService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hotels")
public class HotelController {

    private final HotelService hotelService;

    public HotelController(HotelService hotelService) {
        this.hotelService = hotelService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Hotel>>> getAllHotels() {
        return ResponseEntity.ok(ApiResponse.ok(hotelService.getAllActiveHotels()));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Hotel>>> searchHotels(@RequestParam(required = false) String destination) {
        return ResponseEntity.ok(ApiResponse.ok(hotelService.searchHotels(destination)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Hotel>> getHotelById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(hotelService.getHotelById(id)));
    }
}

