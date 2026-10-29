package com.codealpha.hotelreservation.controller;

import com.codealpha.hotelreservation.dto.ApiResponse;
import com.codealpha.hotelreservation.dto.ResponseDtos;
import com.codealpha.hotelreservation.dto.SearchAndBookingRequests;
import com.codealpha.hotelreservation.entity.RoomType;
import com.codealpha.hotelreservation.service.RoomService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping("/types")
    public ResponseEntity<ApiResponse<List<RoomType>>> getAllRoomTypes() {
        return ResponseEntity.ok(ApiResponse.ok(roomService.getAllRoomTypes()));
    }

    @GetMapping("/types/{id}")
    public ResponseEntity<ApiResponse<RoomType>> getRoomTypeById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(roomService.getRoomTypeById(id)));
    }

    @PostMapping("/search")
    public ResponseEntity<ApiResponse<List<ResponseDtos.RoomAvailabilityDto>>> searchAvailableRooms(
            @Valid @RequestBody SearchAndBookingRequests.HotelSearchRequest request) {
        List<ResponseDtos.RoomAvailabilityDto> availableRooms = roomService.searchAvailableRooms(request);
        return ResponseEntity.ok(ApiResponse.ok("Rooms retrieved successfully", availableRooms));
    }
}

