package com.codealpha.hotelreservation.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class ResponseDtos {

    public static class PriceBreakdownDto {
        private BigDecimal roomRatePerNight;
        private int numberOfNights;
        private int numberOfRooms;
        private BigDecimal subtotal;
        private BigDecimal taxAmount;
        private BigDecimal taxRatePercent;
        private BigDecimal feeAmount;
        private BigDecimal discountAmount;
        private BigDecimal totalAmount;
        private String currency;

        public PriceBreakdownDto() {}

        public BigDecimal getRoomRatePerNight() { return roomRatePerNight; }
        public void setRoomRatePerNight(BigDecimal roomRatePerNight) { this.roomRatePerNight = roomRatePerNight; }

        public int getNumberOfNights() { return numberOfNights; }
        public void setNumberOfNights(int numberOfNights) { this.numberOfNights = numberOfNights; }

        public int getNumberOfRooms() { return numberOfRooms; }
        public void setNumberOfRooms(int numberOfRooms) { this.numberOfRooms = numberOfRooms; }

        public BigDecimal getSubtotal() { return subtotal; }
        public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

        public BigDecimal getTaxAmount() { return taxAmount; }
        public void setTaxAmount(BigDecimal taxAmount) { this.taxAmount = taxAmount; }

        public BigDecimal getTaxRatePercent() { return taxRatePercent; }
        public void setTaxRatePercent(BigDecimal taxRatePercent) { this.taxRatePercent = taxRatePercent; }

        public BigDecimal getFeeAmount() { return feeAmount; }
        public void setFeeAmount(BigDecimal feeAmount) { this.feeAmount = feeAmount; }

        public BigDecimal getDiscountAmount() { return discountAmount; }
        public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }

        public BigDecimal getTotalAmount() { return totalAmount; }
        public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

        public String getCurrency() { return currency; }
        public void setCurrency(String currency) { this.currency = currency; }
    }

    public static class RoomAvailabilityDto {
        private Long hotelId;
        private String hotelName;
        private String hotelCity;
        private Long roomTypeId;
        private String roomTypeCode;
        private String displayName;
        private String description;
        private BigDecimal pricePerNight;
        private BigDecimal calculatedTotal;
        private int numberOfNights;
        private int maxOccupancy;
        private String bedType;
        private int sizeSqFt;
        private String amenities;
        private String imageUrl;
        private String model3dType;
        private int availableRoomsCount;
        private Long sampleRoomId;
        private String cancellationPolicy;

        public RoomAvailabilityDto() {}

        public Long getHotelId() { return hotelId; }
        public void setHotelId(Long hotelId) { this.hotelId = hotelId; }

        public String getHotelName() { return hotelName; }
        public void setHotelName(String hotelName) { this.hotelName = hotelName; }

        public String getHotelCity() { return hotelCity; }
        public void setHotelCity(String hotelCity) { this.hotelCity = hotelCity; }

        public Long getRoomTypeId() { return roomTypeId; }
        public void setRoomTypeId(Long roomTypeId) { this.roomTypeId = roomTypeId; }

        public String getRoomTypeCode() { return roomTypeCode; }
        public void setRoomTypeCode(String roomTypeCode) { this.roomTypeCode = roomTypeCode; }

        public String getDisplayName() { return displayName; }
        public void setDisplayName(String displayName) { this.displayName = displayName; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public BigDecimal getPricePerNight() { return pricePerNight; }
        public void setPricePerNight(BigDecimal pricePerNight) { this.pricePerNight = pricePerNight; }

        public BigDecimal getCalculatedTotal() { return calculatedTotal; }
        public void setCalculatedTotal(BigDecimal calculatedTotal) { this.calculatedTotal = calculatedTotal; }

        public int getNumberOfNights() { return numberOfNights; }
        public void setNumberOfNights(int numberOfNights) { this.numberOfNights = numberOfNights; }

        public int getMaxOccupancy() { return maxOccupancy; }
        public void setMaxOccupancy(int maxOccupancy) { this.maxOccupancy = maxOccupancy; }

        public String getBedType() { return bedType; }
        public void setBedType(String bedType) { this.bedType = bedType; }

        public int getSizeSqFt() { return sizeSqFt; }
        public void setSizeSqFt(int sizeSqFt) { this.sizeSqFt = sizeSqFt; }

        public String getAmenities() { return amenities; }
        public void setAmenities(String amenities) { this.amenities = amenities; }

        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

        public String getModel3dType() { return model3dType; }
        public void setModel3dType(String model3dType) { this.model3dType = model3dType; }

        public int getAvailableRoomsCount() { return availableRoomsCount; }
        public void setAvailableRoomsCount(int availableRoomsCount) { this.availableRoomsCount = availableRoomsCount; }

        public Long getSampleRoomId() { return sampleRoomId; }
        public void setSampleRoomId(Long sampleRoomId) { this.sampleRoomId = sampleRoomId; }

        public String getCancellationPolicy() { return cancellationPolicy; }
        public void setCancellationPolicy(String cancellationPolicy) { this.cancellationPolicy = cancellationPolicy; }
    }

    public static class BookingResponseDto {
        private String bookingReference;
        private String status;
        private Long reservationId;
        private String hotelName;
        private String hotelAddress;
        private String hotelCity;
        private String roomTypeName;
        private String roomNumber;
        private LocalDate checkInDate;
        private LocalDate checkOutDate;
        private int numberOfNights;
        private int guestsCount;
        private BigDecimal totalAmount;
        private String currency;
        private String paymentStatus;
        private String paymentMethod;
        private String transactionReference;
        private String guestFullName;
        private String guestEmail;
        private String termsVersionAccepted;
        private String cancellationPolicySummary;
        private LocalDateTime createdAt;
        private boolean eligibleForSleepingBabyAnimation;

        public BookingResponseDto() {}

        public String getBookingReference() { return bookingReference; }
        public void setBookingReference(String bookingReference) { this.bookingReference = bookingReference; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public Long getReservationId() { return reservationId; }
        public void setReservationId(Long reservationId) { this.reservationId = reservationId; }

        public String getHotelName() { return hotelName; }
        public void setHotelName(String hotelName) { this.hotelName = hotelName; }

        public String getHotelAddress() { return hotelAddress; }
        public void setHotelAddress(String hotelAddress) { this.hotelAddress = hotelAddress; }

        public String getHotelCity() { return hotelCity; }
        public void setHotelCity(String hotelCity) { this.hotelCity = hotelCity; }

        public String getRoomTypeName() { return roomTypeName; }
        public void setRoomTypeName(String roomTypeName) { this.roomTypeName = roomTypeName; }

        public String getRoomNumber() { return roomNumber; }
        public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

        public LocalDate getCheckInDate() { return checkInDate; }
        public void setCheckInDate(LocalDate checkInDate) { this.checkInDate = checkInDate; }

        public LocalDate getCheckOutDate() { return checkOutDate; }
        public void setCheckOutDate(LocalDate checkOutDate) { this.checkOutDate = checkOutDate; }

        public int getNumberOfNights() { return numberOfNights; }
        public void setNumberOfNights(int numberOfNights) { this.numberOfNights = numberOfNights; }

        public int getGuestsCount() { return guestsCount; }
        public void setGuestsCount(int guestsCount) { this.guestsCount = guestsCount; }

        public BigDecimal getTotalAmount() { return totalAmount; }
        public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

        public String getCurrency() { return currency; }
        public void setCurrency(String currency) { this.currency = currency; }

        public String getPaymentStatus() { return paymentStatus; }
        public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

        public String getPaymentMethod() { return paymentMethod; }
        public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

        public String getTransactionReference() { return transactionReference; }
        public void setTransactionReference(String transactionReference) { this.transactionReference = transactionReference; }

        public String getGuestFullName() { return guestFullName; }
        public void setGuestFullName(String guestFullName) { this.guestFullName = guestFullName; }

        public String getGuestEmail() { return guestEmail; }
        public void setGuestEmail(String guestEmail) { this.guestEmail = guestEmail; }

        public String getTermsVersionAccepted() { return termsVersionAccepted; }
        public void setTermsVersionAccepted(String termsVersionAccepted) { this.termsVersionAccepted = termsVersionAccepted; }

        public String getCancellationPolicySummary() { return cancellationPolicySummary; }
        public void setCancellationPolicySummary(String cancellationPolicySummary) { this.cancellationPolicySummary = cancellationPolicySummary; }

        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

        public boolean isEligibleForSleepingBabyAnimation() { return eligibleForSleepingBabyAnimation; }
        public void setEligibleForSleepingBabyAnimation(boolean eligibleForSleepingBabyAnimation) { this.eligibleForSleepingBabyAnimation = eligibleForSleepingBabyAnimation; }
    }

    public static class ReservationDto {
        private Long id;
        private String bookingReference;
        private Long hotelId;
        private String hotelName;
        private String hotelAddress;
        private String hotelCity;
        private String roomTypeName;
        private String roomNumber;
        private LocalDate checkInDate;
        private LocalDate checkOutDate;
        private int numberOfNights;
        private int adults;
        private int children;
        private int numberOfRooms;
        private String status;
        private BigDecimal roomRatePerNight;
        private BigDecimal subtotalAmount;
        private BigDecimal taxAmount;
        private BigDecimal feeAmount;
        private BigDecimal discountAmount;
        private BigDecimal totalAmount;
        private String currency;
        private String paymentMethod;
        private String paymentStatus;
        private String transactionReference;
        private String guestName;
        private String guestEmail;
        private String guestPhone;
        private String specialRequests;
        private String cancellationPolicySummary;
        private boolean canCancel;
        private BigDecimal potentialRefundAmount;
        private LocalDateTime createdAt;

        public ReservationDto() {}

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getBookingReference() { return bookingReference; }
        public void setBookingReference(String bookingReference) { this.bookingReference = bookingReference; }

        public Long getHotelId() { return hotelId; }
        public void setHotelId(Long hotelId) { this.hotelId = hotelId; }

        public String getHotelName() { return hotelName; }
        public void setHotelName(String hotelName) { this.hotelName = hotelName; }

        public String getHotelAddress() { return hotelAddress; }
        public void setHotelAddress(String hotelAddress) { this.hotelAddress = hotelAddress; }

        public String getHotelCity() { return hotelCity; }
        public void setHotelCity(String hotelCity) { this.hotelCity = hotelCity; }

        public String getRoomTypeName() { return roomTypeName; }
        public void setRoomTypeName(String roomTypeName) { this.roomTypeName = roomTypeName; }

        public String getRoomNumber() { return roomNumber; }
        public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

        public LocalDate getCheckInDate() { return checkInDate; }
        public void setCheckInDate(LocalDate checkInDate) { this.checkInDate = checkInDate; }

        public LocalDate getCheckOutDate() { return checkOutDate; }
        public void setCheckOutDate(LocalDate checkOutDate) { this.checkOutDate = checkOutDate; }

        public int getNumberOfNights() { return numberOfNights; }
        public void setNumberOfNights(int numberOfNights) { this.numberOfNights = numberOfNights; }

        public int getAdults() { return adults; }
        public void setAdults(int adults) { this.adults = adults; }

        public int getChildren() { return children; }
        public void setChildren(int children) { this.children = children; }

        public int getNumberOfRooms() { return numberOfRooms; }
        public void setNumberOfRooms(int numberOfRooms) { this.numberOfRooms = numberOfRooms; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public BigDecimal getRoomRatePerNight() { return roomRatePerNight; }
        public void setRoomRatePerNight(BigDecimal roomRatePerNight) { this.roomRatePerNight = roomRatePerNight; }

        public BigDecimal getSubtotalAmount() { return subtotalAmount; }
        public void setSubtotalAmount(BigDecimal subtotalAmount) { this.subtotalAmount = subtotalAmount; }

        public BigDecimal getTaxAmount() { return taxAmount; }
        public void setTaxAmount(BigDecimal taxAmount) { this.taxAmount = taxAmount; }

        public BigDecimal getFeeAmount() { return feeAmount; }
        public void setFeeAmount(BigDecimal feeAmount) { this.feeAmount = feeAmount; }

        public BigDecimal getDiscountAmount() { return discountAmount; }
        public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }

        public BigDecimal getTotalAmount() { return totalAmount; }
        public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

        public String getCurrency() { return currency; }
        public void setCurrency(String currency) { this.currency = currency; }

        public String getPaymentMethod() { return paymentMethod; }
        public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

        public String getPaymentStatus() { return paymentStatus; }
        public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

        public String getTransactionReference() { return transactionReference; }
        public void setTransactionReference(String transactionReference) { this.transactionReference = transactionReference; }

        public String getGuestName() { return guestName; }
        public void setGuestName(String guestName) { this.guestName = guestName; }

        public String getGuestEmail() { return guestEmail; }
        public void setGuestEmail(String guestEmail) { this.guestEmail = guestEmail; }

        public String getGuestPhone() { return guestPhone; }
        public void setGuestPhone(String guestPhone) { this.guestPhone = guestPhone; }

        public String getSpecialRequests() { return specialRequests; }
        public void setSpecialRequests(String specialRequests) { this.specialRequests = specialRequests; }

        public String getCancellationPolicySummary() { return cancellationPolicySummary; }
        public void setCancellationPolicySummary(String cancellationPolicySummary) { this.cancellationPolicySummary = cancellationPolicySummary; }

        public boolean isCanCancel() { return canCancel; }
        public void setCanCancel(boolean canCancel) { this.canCancel = canCancel; }

        public BigDecimal getPotentialRefundAmount() { return potentialRefundAmount; }
        public void setPotentialRefundAmount(BigDecimal potentialRefundAmount) { this.potentialRefundAmount = potentialRefundAmount; }

        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }

    public static class CancellationResponseDto {
        private String bookingReference;
        private LocalDateTime cancelledAt;
        private BigDecimal refundAmount;
        private String refundStatus;
        private String policyApplied;
        private String message;

        public CancellationResponseDto() {}

        public String getBookingReference() { return bookingReference; }
        public void setBookingReference(String bookingReference) { this.bookingReference = bookingReference; }

        public LocalDateTime getCancelledAt() { return cancelledAt; }
        public void setCancelledAt(LocalDateTime cancelledAt) { this.cancelledAt = cancelledAt; }

        public BigDecimal getRefundAmount() { return refundAmount; }
        public void setRefundAmount(BigDecimal refundAmount) { this.refundAmount = refundAmount; }

        public String getRefundStatus() { return refundStatus; }
        public void setRefundStatus(String refundStatus) { this.refundStatus = refundStatus; }

        public String getPolicyApplied() { return policyApplied; }
        public void setPolicyApplied(String policyApplied) { this.policyApplied = policyApplied; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    public static class AdminDashboardDto {
        private BigDecimal totalRevenue;
        private long totalBookings;
        private long confirmedBookings;
        private long cancelledBookings;
        private double occupancyRatePercent;
        private long totalRooms;
        private long totalHotels;
        private List<ReservationDto> recentReservations;

        public AdminDashboardDto() {}

        public BigDecimal getTotalRevenue() { return totalRevenue; }
        public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

        public long getTotalBookings() { return totalBookings; }
        public void setTotalBookings(long totalBookings) { this.totalBookings = totalBookings; }

        public long getConfirmedBookings() { return confirmedBookings; }
        public void setConfirmedBookings(long confirmedBookings) { this.confirmedBookings = confirmedBookings; }

        public long getCancelledBookings() { return cancelledBookings; }
        public void setCancelledBookings(long cancelledBookings) { this.cancelledBookings = cancelledBookings; }

        public double getOccupancyRatePercent() { return occupancyRatePercent; }
        public void setOccupancyRatePercent(double occupancyRatePercent) { this.occupancyRatePercent = occupancyRatePercent; }

        public long getTotalRooms() { return totalRooms; }
        public void setTotalRooms(long totalRooms) { this.totalRooms = totalRooms; }

        public long getTotalHotels() { return totalHotels; }
        public void setTotalHotels(long totalHotels) { this.totalHotels = totalHotels; }

        public List<ReservationDto> getRecentReservations() { return recentReservations; }
        public void setRecentReservations(List<ReservationDto> recentReservations) { this.recentReservations = recentReservations; }
    }
}

