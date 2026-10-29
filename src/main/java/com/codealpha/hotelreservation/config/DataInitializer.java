package com.codealpha.hotelreservation.config;

import com.codealpha.hotelreservation.entity.*;
import com.codealpha.hotelreservation.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final HotelRepository hotelRepository;
    private final RoomTypeRepository roomTypeRepository;
    private final RoomRepository roomRepository;
    private final ReservationRepository reservationRepository;
    private final PaymentRepository paymentRepository;
    private final GuestRepository guestRepository;
    private final TermsAcceptanceRepository termsAcceptanceRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           HotelRepository hotelRepository,
                           RoomTypeRepository roomTypeRepository,
                           RoomRepository roomRepository,
                           ReservationRepository reservationRepository,
                           PaymentRepository paymentRepository,
                           GuestRepository guestRepository,
                           TermsAcceptanceRepository termsAcceptanceRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.hotelRepository = hotelRepository;
        this.roomTypeRepository = roomTypeRepository;
        this.roomRepository = roomRepository;
        this.reservationRepository = reservationRepository;
        this.paymentRepository = paymentRepository;
        this.guestRepository = guestRepository;
        this.termsAcceptanceRepository = termsAcceptanceRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        initUsers();
        initHotelsAndRooms();
    }

    private void initUsers() {
        if (!userRepository.existsByEmail("demo@codealpha.com")) {
            User demoUser = new User(
                    "demo@codealpha.com",
                    "+1 (555) 234-5678",
                    "Julian Vance",
                    passwordEncoder.encode("password123"),
                    "ROLE_USER",
                    "LOCAL"
            );
            userRepository.save(demoUser);
        }

        if (!userRepository.existsByEmail("admin@codealpha.com")) {
            User adminUser = new User(
                    "admin@codealpha.com",
                    "+1 (555) 999-0000",
                    "Elena Rostova (Executive Director)",
                    passwordEncoder.encode("admin123"),
                    "ROLE_ADMIN",
                    "LOCAL"
            );
            userRepository.save(adminUser);
        }
    }

    private void initHotelsAndRooms() {
        if (hotelRepository.count() > 0) {
            return;
        }

        // 1. Room Types
        RoomType standard = new RoomType(
                "STANDARD",
                "CodeAlpha Heritage Classic",
                "A sophisticated sanctuary featuring bespoke Italian linen, a dedicated marble workstation, high-speed fiber connectivity, and acoustic soundproofing. Practical luxury for discerning guests.",
                new BigDecimal("220.00"),
                2,
                "1 Plush Queen Bed",
                380,
                "High-Speed Wi-Fi, Nespresso Machine, Smart TV 55\", Marble Shower, Rain Showerhead, Luxury Toiletries, 24/7 Room Service",
                "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
                "STANDARD"
        );
        standard = roomTypeRepository.save(standard);

        RoomType deluxe = new RoomType(
                "DELUXE",
                "CodeAlpha Executive Horizon",
                "Spacious luxury featuring floor-to-ceiling panoramic views, a plush velvet seating lounge, private balcony, walk-in closet, and designer champagne bar.",
                new BigDecimal("390.00"),
                3,
                "1 Cal-King Bed with Down Duvet",
                560,
                "Panoramic Balcony, Deep Soaking Tub, Hermès Bath Amenities, Bose Sound System, 65\" OLED TV, Complimentary Mini Bar, Evening Turndown Service",
                "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
                "DELUXE"
        );
        deluxe = roomTypeRepository.save(deluxe);

        RoomType suite = new RoomType(
                "SUITE",
                "CodeAlpha Royal Panorama Suite",
                "The pinnacle of bespoke hospitality. Features an expansive separate dining and drawing salon, private heated terrace, butler pantry, and marble bathroom with soaking tub overlooking the city skyline.",
                new BigDecimal("750.00"),
                4,
                "1 Emperor King Bed + Queen Daybed",
                920,
                "Private Butler Service, Heated Terrace Jacuzzi, Dyson Supersonic Styling, Champagne Welcome, Chauffeur Airport Transfer, Walk-in Dressing Suite",
                "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80",
                "SUITE"
        );
        suite = roomTypeRepository.save(suite);

        // 2. Hotels
        Hotel paris = new Hotel(
                "CodeAlpha Grand Palace & Spa",
                "CAGP-01",
                "CodeAlpha Signature Collection",
                "Nestled along the prestigious Avenue Montaigne, this landmark neo-classical palace combines Haussmann grandeur with state-of-the-art contemporary luxury. Featuring a Michelin-starred dining room and private thermal spa.",
                "18 Avenue Montaigne, 8th Arrondissement",
                "Paris",
                "France",
                5.0,
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
                "Thermal Spa & Hydrotherapy, Michelin Dining, Rooftop Champagne Bar, Private Concierge, Valet Parking, Heated Indoor Lap Pool"
        );
        paris = hotelRepository.save(paris);

        Hotel dubai = new Hotel(
                "CodeAlpha Royal Azure Resort",
                "CARA-02",
                "CodeAlpha Signature Collection",
                "An architectural masterpiece rising gracefully along the crystalline shores of Palm Jumeirah. Enjoy private oceanfront cabanas, underwater fine dining, and panoramic sunset views over the Arabian Gulf.",
                "Crescent Road, The Palm Jumeirah",
                "Dubai",
                "United Arab Emirates",
                5.0,
                "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
                "Private Beach Access, Infinity Sky Pool, Heliport, Luxury Yacht Charters, World-Class Tennis Club, Caviar & Oyster Lounge"
        );
        dubai = hotelRepository.save(dubai);

        Hotel ny = new Hotel(
                "CodeAlpha Skyline Reserve",
                "CASR-03",
                "CodeAlpha Signature Collection",
                "Rising above Central Park South, this soaring sanctuary offers breathtaking views of Manhattan's skyline. Featuring curated modern art collections, a tranquil Japanese subterranean bathhouse, and discreet biometric security.",
                "110 Central Park South",
                "New York",
                "United States",
                5.0,
                "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80",
                "Central Park Panoramic Views, Subterranean Onsen, Private Screening Room, Sommelier Tasting Cellar, 24-Hour Tesla Chauffeur"
        );
        ny = hotelRepository.save(ny);

        Hotel kyoto = new Hotel(
                "CodeAlpha Sanctuary Kyoto",
                "CASK-04",
                "CodeAlpha Heritage Retreats",
                "Perched amidst ancient cedar groves at the foot of Mount Higashiyama. A serene architectural fusion of traditional Sukiya-style woodwork and minimalist modern design overlooking tranquil stone zen gardens.",
                "34 Nanzenji Fukuchicho, Sakyo Ward",
                "Kyoto",
                "Japan",
                5.0,
                "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
                "Natural Mineral Hot Springs, Private Kaiseki Dining, Tea Ceremony Pavilion, Zen Meditation Garden, Bamboo Forest Walking Trail"
        );
        kyoto = hotelRepository.save(kyoto);

        // 3. Create Rooms for each hotel
        List<Hotel> hotels = List.of(paris, dubai, ny, kyoto);
        for (Hotel h : hotels) {
            // Standard rooms
            roomRepository.save(new Room("101", 1, h, standard));
            roomRepository.save(new Room("102", 1, h, standard));
            roomRepository.save(new Room("103", 1, h, standard));

            // Deluxe rooms
            roomRepository.save(new Room("201", 2, h, deluxe));
            roomRepository.save(new Room("202", 2, h, deluxe));
            roomRepository.save(new Room("203", 2, h, deluxe));

            // Suites
            roomRepository.save(new Room("301", 3, h, suite));
            roomRepository.save(new Room("302", 3, h, suite));
        }

        // 4. Create one initial demo confirmed reservation for demoUser
        User demoUser = userRepository.findByEmail("demo@codealpha.com").orElse(null);
        if (demoUser != null) {
            Room bookedRoom = roomRepository.findByHotelIdAndRoomTypeCodeAndActiveTrue(paris.getId(), "DELUXE").get(0);

            Reservation sampleRes = new Reservation();
            sampleRes.setBookingReference("CA-2026-PARIS01");
            sampleRes.setUser(demoUser);
            sampleRes.setHotel(paris);
            sampleRes.setRoom(bookedRoom);
            sampleRes.setCheckInDate(LocalDate.now().plusDays(10));
            sampleRes.setCheckOutDate(LocalDate.now().plusDays(14));
            sampleRes.setNumberOfNights(4);
            sampleRes.setAdults(2);
            sampleRes.setChildren(0);
            sampleRes.setNumberOfRooms(1);
            sampleRes.setRoomRatePerNight(deluxe.getBasePricePerNight());
            sampleRes.setSubtotalAmount(new BigDecimal("1560.00"));
            sampleRes.setTaxAmount(new BigDecimal("187.20"));
            sampleRes.setFeeAmount(new BigDecimal("25.00"));
            sampleRes.setDiscountAmount(BigDecimal.ZERO);
            sampleRes.setTotalAmount(new BigDecimal("1772.20"));
            sampleRes.setCurrency("USD");
            sampleRes.setPaymentMethod("CARD");
            sampleRes.setStatus("CONFIRMED");
            sampleRes.setTermsVersionAccepted("v2026.1");
            sampleRes.setCancellationPolicySummary("Standard Flexible Policy: Free cancellation up to 48 hours prior to check-in.");
            sampleRes.setCreatedAt(LocalDateTime.now().minusDays(1));
            sampleRes = reservationRepository.save(sampleRes);

            Payment samplePayment = new Payment();
            samplePayment.setReservation(sampleRes);
            samplePayment.setTransactionReference("TXN-DEMO-INIT99");
            samplePayment.setPaymentMethod("CARD");
            samplePayment.setAmount(sampleRes.getTotalAmount());
            samplePayment.setCurrency("USD");
            samplePayment.setStatus("SUCCESS");
            samplePayment.setSimulatedOutcome("SUCCESS");
            samplePayment.setSimulatedNotes("Simulated seed booking authorized");
            samplePayment.setCreatedAt(LocalDateTime.now().minusDays(1));
            samplePayment.setCompletedAt(LocalDateTime.now().minusDays(1));
            paymentRepository.save(samplePayment);

            Guest sampleGuest = new Guest(sampleRes, "Julian Vance", "demo@codealpha.com", "+1 (555) 234-5678", "United States", "High floor with sunset Eiffel Tower view requested.");
            guestRepository.save(sampleGuest);

            TermsAcceptance terms = new TermsAcceptance(demoUser, sampleRes, "v2026.1", "127.0.0.1", "Initial Demo Seed");
            termsAcceptanceRepository.save(terms);
        }
    }
}

