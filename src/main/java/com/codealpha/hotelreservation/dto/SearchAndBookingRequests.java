package com.codealpha.hotelreservation.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public class SearchAndBookingRequests {

    public static class HotelSearchRequest {
        private String destination;

        @NotNull(message = "Check-in date is required")
        private LocalDate checkInDate;

        @NotNull(message = "Check-out date is required")
        private LocalDate checkOutDate;

        @Min(value = 1, message = "At least 1 adult is required")
        private int adults = 1;

        @Min(value = 0, message = "Children cannot be negative")
        private int children = 0;

        @Min(value = 1, message = "At least 1 room is required")
        private int rooms = 1;

        public String getDestination() { return destination; }
        public void setDestination(String destination) { this.destination = destination; }

        public LocalDate getCheckInDate() { return checkInDate; }
        public void setCheckInDate(LocalDate checkInDate) { this.checkInDate = checkInDate; }

        public LocalDate getCheckOutDate() { return checkOutDate; }
        public void setCheckOutDate(LocalDate checkOutDate) { this.checkOutDate = checkOutDate; }

        public int getAdults() { return adults; }
        public void setAdults(int adults) { this.adults = adults; }

        public int getChildren() { return children; }
        public void setChildren(int children) { this.children = children; }

        public int getRooms() { return rooms; }
        public void setRooms(int rooms) { this.rooms = rooms; }
    }

    public static class PriceQuoteRequest {
        @NotNull(message = "Hotel ID is required")
        private Long hotelId;

        @NotNull(message = "Room Type ID is required")
        private Long roomTypeId;

        @NotNull(message = "Check-in date is required")
        private LocalDate checkInDate;

        @NotNull(message = "Check-out date is required")
        private LocalDate checkOutDate;

        @Min(1)
        private int rooms = 1;

        public Long getHotelId() { return hotelId; }
        public void setHotelId(Long hotelId) { this.hotelId = hotelId; }

        public Long getRoomTypeId() { return roomTypeId; }
        public void setRoomTypeId(Long roomTypeId) { this.roomTypeId = roomTypeId; }

        public LocalDate getCheckInDate() { return checkInDate; }
        public void setCheckInDate(LocalDate checkInDate) { this.checkInDate = checkInDate; }

        public LocalDate getCheckOutDate() { return checkOutDate; }
        public void setCheckOutDate(LocalDate checkOutDate) { this.checkOutDate = checkOutDate; }

        public int getRooms() { return rooms; }
        public void setRooms(int rooms) { this.rooms = rooms; }
    }

    public static class BookingRequest {
        @NotNull(message = "Hotel ID is required")
        private Long hotelId;

        @NotNull(message = "Room Type ID is required")
        private Long roomTypeId;

        private Long specificRoomId;

        @NotNull(message = "Check-in date is required")
        private LocalDate checkInDate;

        @NotNull(message = "Check-out date is required")
        private LocalDate checkOutDate;

        @Min(value = 1, message = "At least 1 adult is required")
        private int adults = 1;

        @Min(value = 0, message = "Children count cannot be negative")
        private int children = 0;

        @Min(value = 1, message = "At least 1 room is required")
        private int rooms = 1;

        @NotBlank(message = "Primary guest name is required")
        private String guestFullName;

        @NotBlank(message = "Guest email is required")
        @Email(message = "Valid email is required")
        private String guestEmail;

        @NotBlank(message = "Guest phone number is required")
        private String guestPhone;

        private String guestCountry = "United States";
        private String specialRequests;

        @NotBlank(message = "Payment method is required")
        private String paymentMethod; // CARD, UPI, PAY_AT_HOTEL

        private String simulatedOutcome = "SUCCESS"; // SUCCESS, DECLINED, CANCELLED, TIMEOUT

        @AssertTrue(message = "You must agree to the Terms, Privacy Policy and Cancellation Policy")
        private boolean acceptTerms = false;

        private String policyVersion = "v2026.1";

        public Long getHotelId() { return hotelId; }
        public void setHotelId(Long hotelId) { this.hotelId = hotelId; }

        public Long getRoomTypeId() { return roomTypeId; }
        public void setRoomTypeId(Long roomTypeId) { this.roomTypeId = roomTypeId; }

        public Long getSpecificRoomId() { return specificRoomId; }
        public void setSpecificRoomId(Long specificRoomId) { this.specificRoomId = specificRoomId; }

        public LocalDate getCheckInDate() { return checkInDate; }
        public void setCheckInDate(LocalDate checkInDate) { this.checkInDate = checkInDate; }

        public LocalDate getCheckOutDate() { return checkOutDate; }
        public void setCheckOutDate(LocalDate checkOutDate) { this.checkOutDate = checkOutDate; }

        public int getAdults() { return adults; }
        public void setAdults(int adults) { this.adults = adults; }

        public int getChildren() { return children; }
        public void setChildren(int children) { this.children = children; }

        public int getRooms() { return rooms; }
        public void setRooms(int rooms) { this.rooms = rooms; }

        public String getGuestFullName() { return guestFullName; }
        public void setGuestFullName(String guestFullName) { this.guestFullName = guestFullName; }

        public String getGuestEmail() { return guestEmail; }
        public void setGuestEmail(String guestEmail) { this.guestEmail = guestEmail; }

        public String getGuestPhone() { return guestPhone; }
        public void setGuestPhone(String guestPhone) { this.guestPhone = guestPhone; }

        public String getGuestCountry() { return guestCountry; }
        public void setGuestCountry(String guestCountry) { this.guestCountry = guestCountry; }

        public String getSpecialRequests() { return specialRequests; }
        public void setSpecialRequests(String specialRequests) { this.specialRequests = specialRequests; }

        public String getPaymentMethod() { return paymentMethod; }
        public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

        public String getSimulatedOutcome() { return simulatedOutcome; }
        public void setSimulatedOutcome(String simulatedOutcome) { this.simulatedOutcome = simulatedOutcome; }

        public boolean isAcceptTerms() { return acceptTerms; }
        public void setAcceptTerms(boolean acceptTerms) { this.acceptTerms = acceptTerms; }

        public String getPolicyVersion() { return policyVersion; }
        public void setPolicyVersion(String policyVersion) { this.policyVersion = policyVersion; }
    }

    public static class CancellationRequest {
        @NotBlank(message = "Cancellation reason is required")
        private String reason;

        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }
    }

    public static class RoomAdminRequest {
        @NotBlank
        private String roomNumber;
        private int floor;
        @NotNull
        private Long hotelId;
        @NotBlank
        private String roomTypeCode;
        private String status = "AVAILABLE";
        private boolean active = true;

        public String getRoomNumber() { return roomNumber; }
        public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }
        public int getFloor() { return floor; }
        public void setFloor(int floor) { this.floor = floor; }
        public Long getHotelId() { return hotelId; }
        public void setHotelId(Long hotelId) { this.hotelId = hotelId; }
        public String getRoomTypeCode() { return roomTypeCode; }
        public void setRoomTypeCode(String roomTypeCode) { this.roomTypeCode = roomTypeCode; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public boolean isActive() { return active; }
        public void setActive(boolean active) { this.active = active; }
    }
}

