/**
 * CodeAlpha 3D Hotel Reservation System
 * Main Application Controller (Vanilla JS + Fetch API)
 */

const App = (function() {
  const state = {
    currentUser: null,
    hotels: [],
    roomTypes: [],
    availableRooms: [],
    activeFilter: 'ALL',
    currentSearch: {
      destination: '',
      checkInDate: '',
      checkOutDate: '',
      adults: 2,
      children: 0,
      rooms: 1
    },
    activeBookingRoom: null,
    currentPriceQuote: null,
    activeReservation: null
  };

  // DOM Elements
  const el = {};

  function init() {
    cacheDom();
    bindEvents();
    initDates();
    checkAuthStatus();
    loadHotelsAndRooms();
  }

  function cacheDom() {
    el.navbar = document.querySelector('.navbar');
    el.userBadge = document.getElementById('nav-user-badge');
    el.loginBtn = document.getElementById('nav-login-btn');
    el.adminLink = document.getElementById('nav-admin-link');
    el.userMenuName = document.getElementById('user-menu-name');
    el.userMenuAvatar = document.getElementById('user-menu-avatar');
    
    // Modals
    el.authModal = document.getElementById('auth-modal');
    el.room3dModal = document.getElementById('room-3d-modal');
    el.bookingModal = document.getElementById('booking-modal');
    el.babyModal = document.getElementById('sleeping-baby-modal');
    el.reservationsSection = document.getElementById('reservations-section');
    el.adminSection = document.getElementById('admin-section');
    el.policyModal = document.getElementById('policy-modal');
    el.voucherModal = document.getElementById('voucher-modal');
    
    // Shutter
    el.shutter = document.getElementById('shutter-container');
    
    // Search fields
    el.searchDestination = document.getElementById('search-destination');
    el.searchCheckIn = document.getElementById('search-checkin');
    el.searchCheckOut = document.getElementById('search-checkout');
    el.searchGuests = document.getElementById('search-guests');
    el.searchRooms = document.getElementById('search-rooms');
    el.searchBtn = document.getElementById('search-hotels-btn');
    
    // Rooms container
    el.roomsGrid = document.getElementById('rooms-grid');
    el.roomsStatus = document.getElementById('rooms-search-status');
  }

  function bindEvents() {
    // Search Button
    if (el.searchBtn) {
      el.searchBtn.addEventListener('click', handleSearch);
    }
    
    // Date changes auto-adjust checkout
    if (el.searchCheckIn) {
      el.searchCheckIn.addEventListener('change', () => {
        const inDate = new Date(el.searchCheckIn.value);
        if (!isNaN(inDate.getTime())) {
          const nextDay = new Date(inDate);
          nextDay.setDate(nextDay.getDate() + 1);
          const nextDayStr = nextDay.toISOString().split('T')[0];
          el.searchCheckOut.min = nextDayStr;
          if (el.searchCheckOut.value <= el.searchCheckIn.value) {
            el.searchCheckOut.value = nextDayStr;
          }
        }
      });
    }

    // Filter Buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        state.activeFilter = e.target.getAttribute('data-filter') || 'ALL';
        renderRoomCards();
      });
    });

    // Nav Links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        const target = e.target.getAttribute('data-nav');
        handleNavigation(target);
      });
    });

    // 3D Lighting toggles
    document.querySelectorAll('.viewer-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        document.querySelectorAll('.viewer-pill').forEach(p => p.classList.remove('active'));
        e.target.classList.add('active');
        const mode = e.target.getAttribute('data-lighting');
        Room3DViewer.setLightingMode(mode);
      });
    });

    // Modal Close buttons
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal-overlay');
        if (modal) closeModal(modal);
      });
    });
  }

  function initDates() {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 2);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 6);
    const nextWeekStr = nextWeek.toISOString().split('T')[0];

    if (el.searchCheckIn) {
      el.searchCheckIn.min = todayStr;
      el.searchCheckIn.value = tomorrowStr;
    }
    if (el.searchCheckOut) {
      el.searchCheckOut.min = tomorrowStr;
      el.searchCheckOut.value = nextWeekStr;
    }

    state.currentSearch.checkInDate = tomorrowStr;
    state.currentSearch.checkOutDate = nextWeekStr;
  }

  /* ==========================================================================
     AUTHENTICATION & SIGNATURE SHUTTER ANIMATION
     ========================================================================== */
  async function checkAuthStatus() {
    try {
      const res = await fetch('/api/auth/me');
      const json = await res.json();
      if (json.success && json.data.authenticated) {
        state.currentUser = json.data;
        updateUserUI();
      } else {
        state.currentUser = null;
        updateUserUI();
      }
    } catch (e) {
      console.warn("Auth check error:", e);
    }
  }

  function updateUserUI() {
    if (state.currentUser) {
      el.loginBtn.style.display = 'none';
      el.userBadge.style.display = 'flex';
      el.userMenuName.textContent = state.currentUser.fullName || state.currentUser.email;
      el.userMenuAvatar.textContent = (state.currentUser.fullName || 'U').charAt(0).toUpperCase();

      if (state.currentUser.role === 'ROLE_ADMIN') {
        el.adminLink.style.display = 'inline-block';
      } else {
        el.adminLink.style.display = 'none';
      }
    } else {
      el.loginBtn.style.display = 'inline-flex';
      el.userBadge.style.display = 'none';
      el.adminLink.style.display = 'none';
    }
  }

  function openAuthModal() {
    openModal(el.authModal);
  }

  function triggerShutterAnimation(callback) {
    if (!el.shutter) {
      if (callback) callback();
      return;
    }

    // Stage 1 & 2: Shutter active and closed
    el.shutter.classList.remove('shutter-opened');
    el.shutter.classList.add('active');

    // Stage 3: Animate shutter upward/split
    setTimeout(() => {
      el.shutter.classList.add('shutter-opened');

      // Stage 4: Complete reveal and restore interactivity
      setTimeout(() => {
        el.shutter.classList.remove('active');
        el.shutter.classList.remove('shutter-opened');
        if (callback) callback();
      }, 1450);
    }, 600);
  }

  async function handleDemoLogin(role = 'USER') {
    try {
      const res = await fetch('/api/auth/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      const json = await res.json();
      if (json.success) {
        state.currentUser = json.data;
        closeModal(el.authModal);
        updateUserUI();

        // Trigger the signature shutter opening transition!
        triggerShutterAnimation(() => {
          showNotification(`Welcome back, ${state.currentUser.fullName}`, 'success');
        });
      } else {
        alert(json.message || "Demo login failed");
      }
    } catch (e) {
      alert("Network error during demo login: " + e.message);
    }
  }

  async function handleSendOtp() {
    const phoneInput = document.getElementById('auth-mobile-input');
    const phone = phoneInput ? phoneInput.value.trim() : '';
    if (!phone) {
      alert("Please enter a valid mobile number with country code.");
      return;
    }

    const otpStatusEl = document.getElementById('otp-status-message');
    if (otpStatusEl) otpStatusEl.innerHTML = '<span style="color:#d4af37;">Dispatching verification code...</span>';

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phone })
      });
      const json = await res.json();
      if (json.success) {
        document.getElementById('mobile-step-1').style.display = 'none';
        document.getElementById('mobile-step-2').style.display = 'block';

        if (json.data.demoOtp) {
          if (otpStatusEl) {
            otpStatusEl.innerHTML = `
              <div style="background:rgba(212,175,55,0.12); border:1px solid #d4af37; padding:0.6rem; border-radius:8px; margin-top:0.6rem;">
                <strong style="color:#f3e5ab;">SANDBOX DEMO OTP:</strong>
                <span style="font-size:1.1rem; color:#fff; font-weight:700; letter-spacing:0.1em; margin-left:0.4rem;">${json.data.demoOtp}</span>
              </div>
            `;
          }
          // Pre-fill demo OTP for smooth testing
          const otpInput = document.getElementById('auth-otp-input');
          if (otpInput) otpInput.value = json.data.demoOtp;
        }
      } else {
        if (otpStatusEl) otpStatusEl.innerHTML = `<span style="color:#fc8181;">${json.message}</span>`;
      }
    } catch (e) {
      if (otpStatusEl) otpStatusEl.innerHTML = `<span style="color:#fc8181;">Network error: ${e.message}</span>`;
    }
  }

  async function handleVerifyOtp() {
    const phone = document.getElementById('auth-mobile-input').value.trim();
    const code = document.getElementById('auth-otp-input').value.trim();
    const fullName = document.getElementById('auth-name-input').value.trim();

    if (!code) {
      alert("Please enter the 6-digit OTP code.");
      return;
    }

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phone, otpCode: code, fullName })
      });
      const json = await res.json();
      if (json.success) {
        state.currentUser = json.data;
        closeModal(el.authModal);
        updateUserUI();

        triggerShutterAnimation(() => {
          showNotification(`Authenticated as ${state.currentUser.fullName}`, 'success');
        });
      } else {
        alert(json.message || "OTP verification failed");
      }
    } catch (e) {
      alert("Error verifying OTP: " + e.message);
    }
  }

  async function handleEmailLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const json = await res.json();
      if (json.success) {
        state.currentUser = json.data;
        closeModal(el.authModal);
        updateUserUI();
        triggerShutterAnimation(() => {
          showNotification(`Welcome back, ${state.currentUser.fullName}`, 'success');
        });
      } else {
        alert(json.message || "Login failed");
      }
    } catch (e) {
      alert("Network error: " + e.message);
    }
  }

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      state.currentUser = null;
      updateUserUI();
      showNotification("You have been signed out.", "info");
      handleNavigation('home');
    } catch (e) {
      console.warn("Logout error:", e);
    }
  }

  /* ==========================================================================
     HOTEL & ROOM CATALOG SEARCH
     ========================================================================== */
  async function loadHotelsAndRooms() {
    try {
      // 1. Fetch Hotels
      const hRes = await fetch('/api/hotels');
      const hJson = await hRes.json();
      if (hJson.success) state.hotels = hJson.data;

      // 2. Fetch Room Types
      const rRes = await fetch('/api/rooms/types');
      const rJson = await rRes.json();
      if (rJson.success) state.roomTypes = rJson.data;

      // Initial search
      handleSearch();
    } catch (e) {
      console.warn("Catalog loading error:", e);
    }
  }

  async function handleSearch() {
    const destination = el.searchDestination.value.trim();
    const checkIn = el.searchCheckIn.value;
    const checkOut = el.searchCheckOut.value;
    const adults = parseInt(el.searchGuests.value, 10) || 2;
    const rooms = parseInt(el.searchRooms.value, 10) || 1;

    // Validation
    const today = new Date().toISOString().split('T')[0];
    if (checkIn < today) {
      showNotification("Check-in date cannot be in the past.", "error");
      return;
    }
    if (checkOut <= checkIn) {
      showNotification("Check-out date must be after check-in date.", "error");
      return;
    }

    state.currentSearch = {
      destination,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      adults,
      children: 0,
      rooms
    };

    if (el.roomsStatus) {
      el.roomsStatus.innerHTML = '<span style="color:#d4af37;">Searching real-time inventory across CodeAlpha luxury suites...</span>';
    }

    try {
      const res = await fetch('/api/rooms/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state.currentSearch)
      });
      const json = await res.json();
      if (json.success) {
        state.availableRooms = json.data;
        renderRoomCards();
        if (el.roomsStatus) {
          el.roomsStatus.innerHTML = `Showing <strong>${state.availableRooms.length}</strong> available luxury categories for <strong>${state.currentSearch.checkInDate}</strong> to <strong>${state.currentSearch.checkOutDate}</strong>`;
        }
      } else {
        if (el.roomsStatus) el.roomsStatus.innerHTML = `<span style="color:#fc8181;">${json.message}</span>`;
      }
    } catch (e) {
      if (el.roomsStatus) el.roomsStatus.innerHTML = `<span style="color:#fc8181;">Network error while querying rooms.</span>`;
    }
  }

  function renderRoomCards() {
    if (!el.roomsGrid) return;
    el.roomsGrid.innerHTML = '';

    const filtered = state.availableRooms.filter(r => {
      if (state.activeFilter === 'ALL') return true;
      if (state.activeFilter === r.roomTypeCode) return true;
      if (r.hotelCity && r.hotelCity.toLowerCase().includes(state.activeFilter.toLowerCase())) return true;
      return false;
    });

    if (filtered.length === 0) {
      el.roomsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: #a0aec0;">
          <div style="font-size: 2.5rem; margin-bottom: 0.8rem;">🏨</div>
          <h3 style="color:#fff; margin-bottom:0.4rem;">No matching rooms found for these criteria</h3>
          <p>Try modifying your dates, selecting fewer rooms, or exploring other destinations.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(room => {
      const card = document.createElement('div');
      card.className = 'glass-card room-card';

      const amenitiesList = room.amenities
        ? room.amenities.split(',').slice(0, 3).map(a => `<span class="amenity-chip">${a.trim()}</span>`).join('')
        : '';

      card.innerHTML = `
        <div class="room-media">
          <img class="room-image" src="${room.imageUrl}" alt="${room.displayName}" loading="lazy">
          <span class="room-tag">${room.roomTypeCode}</span>
          <button class="room-3d-badge" onclick="App.open3dTour('${room.roomTypeCode}', '${room.displayName}')">
            <span>✧</span> 3D Tour
          </button>
        </div>
        <div class="room-body">
          <div class="room-hotel">${room.hotelName} • ${room.hotelCity}</div>
          <h3 class="room-title">${room.displayName}</h3>
          <div class="room-specs">
            <span class="spec-item">👤 Up to ${room.maxOccupancy} Guests</span>
            <span class="spec-item">🛏 ${room.bedType}</span>
            <span class="spec-item">📐 ${room.sizeSqFt} sq ft</span>
          </div>
          <p style="font-size:0.86rem; color:#a0aec0; margin-bottom:1rem; line-height:1.5;">${room.description || ''}</p>
          <div class="room-amenities">${amenitiesList}</div>
          <div class="room-footer">
            <div class="room-price-box">
              <span class="price-label">${room.numberOfNights} Nights • Total</span>
              <span class="price-amount">$${room.calculatedTotal ? room.calculatedTotal.toFixed(2) : room.pricePerNight.toFixed(2)}</span>
            </div>
            <button class="btn btn-gold btn-sm" onclick='App.openBookingModal(${JSON.stringify(room).replace(/'/g, "&#39;")})'>
              Reserve Room
            </button>
          </div>
        </div>
      `;
      el.roomsGrid.appendChild(card);
    });
  }

  /* ==========================================================================
     3D ROOM TOUR MODAL
     ========================================================================== */
  function open3dTour(roomTypeCode, title) {
    document.getElementById('modal-3d-title').textContent = title + " — 3D Interactive Suite";
    openModal(el.room3dModal);
    const canvasContainer = document.getElementById('three-canvas-container');
    setTimeout(() => {
      Room3DViewer.init(canvasContainer, roomTypeCode);
    }, 200);
  }

  /* ==========================================================================
     BOOKING & CHECKOUT WORKFLOW
     ========================================================================== */
  async function openBookingModal(room) {
    if (!state.currentUser) {
      showNotification("Please sign in or select Demo Access to complete your reservation.", "info");
      openAuthModal();
      return;
    }

    state.activeBookingRoom = room;

    document.getElementById('booking-modal-title').textContent = room.displayName;
    document.getElementById('booking-modal-hotel').textContent = room.hotelName + " • " + room.hotelCity;
    document.getElementById('booking-guest-name').value = state.currentUser.fullName || '';
    document.getElementById('booking-guest-email').value = state.currentUser.email || '';
    document.getElementById('booking-guest-phone').value = state.currentUser.phoneNumber || '+1 (555) 234-5678';
    document.getElementById('booking-terms-check').checked = false;

    // Fetch authoritative server quote
    try {
      const quoteRes = await fetch('/api/bookings/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotelId: room.hotelId,
          roomTypeId: room.roomTypeId,
          checkInDate: state.currentSearch.checkInDate,
          checkOutDate: state.currentSearch.checkOutDate,
          rooms: state.currentSearch.rooms
        })
      });
      const quoteJson = await quoteRes.json();
      if (quoteJson.success) {
        state.currentPriceQuote = quoteJson.data;
        updateBookingSummaryUI(quoteJson.data);
      }
    } catch (e) {
      console.warn("Quote calculation error:", e);
    }

    openModal(el.bookingModal);
  }

  function updateBookingSummaryUI(quote) {
    document.getElementById('quote-nights').textContent = quote.numberOfNights;
    document.getElementById('quote-rooms').textContent = quote.numberOfRooms;
    document.getElementById('quote-rate').textContent = "$" + quote.roomRatePerNight.toFixed(2);
    document.getElementById('quote-subtotal').textContent = "$" + quote.subtotal.toFixed(2);
    document.getElementById('quote-tax').textContent = "$" + quote.taxAmount.toFixed(2) + " (" + quote.taxRatePercent + "% sample tax)";
    document.getElementById('quote-fee').textContent = "$" + quote.feeAmount.toFixed(2) + " (resort service fee)";
    document.getElementById('quote-total').textContent = "$" + quote.totalAmount.toFixed(2) + " " + quote.currency;
  }

  async function handleConfirmBooking() {
    if (!state.activeBookingRoom) return;

    const termsChecked = document.getElementById('booking-terms-check').checked;
    if (!termsChecked) {
      alert("You must agree to the Terms and Conditions, Privacy Policy, and Cancellation Policy to complete this reservation.");
      return;
    }

    const guestName = document.getElementById('booking-guest-name').value.trim();
    const guestEmail = document.getElementById('booking-guest-email').value.trim();
    const guestPhone = document.getElementById('booking-guest-phone').value.trim();
    const specialRequests = document.getElementById('booking-special-requests').value.trim();
    const paymentMethod = document.getElementById('booking-payment-method').value;
    const simulatedOutcome = document.getElementById('booking-simulated-outcome').value;

    if (!guestName || !guestEmail || !guestPhone) {
      alert("Please enter the primary guest name, email, and phone number.");
      return;
    }

    const confirmBtn = document.getElementById('btn-confirm-reservation');
    confirmBtn.disabled = true;
    confirmBtn.textContent = "Processing simulated authorization...";

    try {
      const payload = {
        hotelId: state.activeBookingRoom.hotelId,
        roomTypeId: state.activeBookingRoom.roomTypeId,
        checkInDate: state.currentSearch.checkInDate,
        checkOutDate: state.currentSearch.checkOutDate,
        adults: state.currentSearch.adults,
        children: state.currentSearch.children,
        rooms: state.currentSearch.rooms,
        guestFullName: guestName,
        guestEmail: guestEmail,
        guestPhone: guestPhone,
        guestCountry: "United States",
        specialRequests,
        paymentMethod,
        simulatedOutcome,
        acceptTerms: true,
        policyVersion: "v2026.1"
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();

      confirmBtn.disabled = false;
      confirmBtn.textContent = "Authorize & Confirm Reservation";

      if (json.success && json.data.status === 'CONFIRMED') {
        state.activeReservation = json.data;
        closeModal(el.bookingModal);

        // ONLY trigger Sleeping Baby 3D Animation because booking is GENUINELY confirmed!
        triggerSleepingBabyAnimation(json.data);

        // Refresh room search to update available inventory
        handleSearch();
      } else {
        // Failed outcome (Declined, Cancelled, Timeout)
        alert(json.message || "Reservation could not be confirmed due to simulated payment rejection.");
      }
    } catch (e) {
      confirmBtn.disabled = false;
      confirmBtn.textContent = "Authorize & Confirm Reservation";
      alert("Error confirming booking: " + e.message);
    }
  }

  /* ==========================================================================
     BOOKING CONFIRMATION — 3D SLEEPING BABY ANIMATION
     ========================================================================== */
  function triggerSleepingBabyAnimation(bookingData) {
    document.getElementById('confirmed-booking-ref').textContent = bookingData.bookingReference;
    document.getElementById('confirmed-hotel-name').textContent = bookingData.hotelName;
    document.getElementById('confirmed-room-name').textContent = bookingData.roomTypeName;
    document.getElementById('confirmed-dates').textContent = bookingData.checkInDate + " to " + bookingData.checkOutDate + " (" + bookingData.numberOfNights + " Nights)";
    document.getElementById('confirmed-amount').textContent = "$" + bookingData.totalAmount.toFixed(2) + " " + bookingData.currency;

    openModal(el.babyModal);

    const babyCanvas = document.getElementById('baby-three-canvas');
    setTimeout(() => {
      SleepingBabyViewer.init(babyCanvas);
    }, 250);
  }

  function replayBabyAnimation() {
    SleepingBabyViewer.replay();
  }

  /* ==========================================================================
     MY RESERVATIONS DASHBOARD
     ========================================================================== */
  async function loadUserReservations(filter = 'ALL') {
    const listContainer = document.getElementById('user-reservations-list');
    if (!listContainer) return;
    listContainer.innerHTML = '<div style="color:#d4af37;">Loading your luxury reservation portfolio...</div>';

    try {
      const res = await fetch('/api/bookings');
      const json = await res.json();
      if (json.success) {
        renderUserReservations(json.data, filter);
      } else {
        listContainer.innerHTML = `<div style="color:#fc8181;">${json.message}</div>`;
      }
    } catch (e) {
      listContainer.innerHTML = `<div style="color:#fc8181;">Error loading reservations: ${e.message}</div>`;
    }
  }

  function renderUserReservations(reservations, filter) {
    const listContainer = document.getElementById('user-reservations-list');
    if (!listContainer) return;
    listContainer.innerHTML = '';

    const today = new Date().toISOString().split('T')[0];
    const filtered = reservations.filter(r => {
      if (filter === 'UPCOMING') return r.status === 'CONFIRMED' && r.checkInDate >= today;
      if (filter === 'PAST') return r.checkOutDate < today;
      if (filter === 'CANCELLED') return r.status === 'CANCELLED';
      return true;
    });

    if (filtered.length === 0) {
      listContainer.innerHTML = `
        <div class="glass-panel" style="padding:3rem; text-align:center; color:#a0aec0;">
          <div style="font-size:2.5rem; margin-bottom:0.8rem;">🛎️</div>
          <h3 style="color:#fff; margin-bottom:0.4rem;">No reservations found in this category</h3>
          <p>Explore our signature properties and reserve your next stay.</p>
          <button class="btn btn-gold btn-sm" style="margin-top:1.2rem;" onclick="App.handleNavigation('explore')">Explore Hotels</button>
        </div>
      `;
      return;
    }

    filtered.forEach(r => {
      const card = document.createElement('div');
      card.className = 'glass-card reservation-card';

      let statusBadge = '';
      if (r.status === 'CONFIRMED') statusBadge = '<span class="status-badge status-confirmed">Confirmed</span>';
      else if (r.status === 'CANCELLED') statusBadge = '<span class="status-badge status-cancelled">Cancelled</span>';
      else statusBadge = `<span class="status-badge status-pending">${r.status}</span>`;

      card.innerHTML = `
        <div>
          <div class="res-ref-tag">Ref: ${r.bookingReference}</div>
          <h3 class="res-hotel-name">${r.hotelName}</h3>
          <div style="color:#c5a880; font-size:0.92rem; margin-bottom:0.4rem;">${r.roomTypeName} • Room ${r.roomNumber || 'Assigned'}</div>
          <div class="res-meta-grid">
            <div>📅 Check-in: <strong>${r.checkInDate}</strong></div>
            <div>📅 Check-out: <strong>${r.checkOutDate}</strong> (${r.numberOfNights} Nights)</div>
            <div>👤 Guests: ${r.adults} Adults${r.children ? ', ' + r.children + ' Children' : ''}</div>
            <div>💳 Payment: ${r.paymentStatus || 'SIMULATED'} (${r.paymentMethod})</div>
          </div>
        </div>
        <div>
          <div style="font-size:0.8rem; color:#718096; text-transform:uppercase;">Total Amount</div>
          <div style="font-size:1.6rem; font-family:'Playfair Display',serif; color:#f3e5ab; font-weight:700;">$${r.totalAmount.toFixed(2)}</div>
          <div style="margin-top:0.4rem;">${statusBadge}</div>
        </div>
        <div style="display:flex; flex-direction:column; gap:0.6rem; align-items:flex-end;">
          <button class="btn btn-outline-gold btn-sm" onclick='App.showVoucherModal(${JSON.stringify(r).replace(/'/g, "&#39;")})'>
            View Voucher
          </button>
          ${r.canCancel ? `
            <button class="btn btn-danger btn-sm" onclick="App.openCancelModal('${r.bookingReference}', ${r.potentialRefundAmount || 0})">
              Cancel Reservation
            </button>
          ` : ''}
        </div>
      `;
      listContainer.appendChild(card);
    });
  }

  function openCancelModal(bookingRef, refundAmount) {
    const modal = document.getElementById('cancel-modal');
    document.getElementById('cancel-modal-ref').textContent = bookingRef;
    document.getElementById('cancel-modal-refund').textContent = "$" + (refundAmount ? refundAmount.toFixed(2) : "0.00");
    document.getElementById('cancel-confirm-btn').onclick = () => executeCancellation(bookingRef);
    openModal(modal);
  }

  async function executeCancellation(bookingRef) {
    const reason = document.getElementById('cancel-reason-input').value.trim() || "Travel schedule change";
    try {
      const res = await fetch(`/api/bookings/${bookingRef}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });
      const json = await res.json();
      if (json.success) {
        closeModal(document.getElementById('cancel-modal'));
        showNotification(json.data.message, "success");
        loadUserReservations();
        handleSearch(); // Room freed, refresh availability
      } else {
        alert(json.message || "Failed to cancel reservation.");
      }
    } catch (e) {
      alert("Error cancelling reservation: " + e.message);
    }
  }

  /* ==========================================================================
     ADMINISTRATOR DASHBOARD
     ========================================================================== */
  async function loadAdminDashboard() {
    if (!state.currentUser || state.currentUser.role !== 'ROLE_ADMIN') {
      showNotification("Administrator privileges required.", "error");
      handleNavigation('home');
      return;
    }

    try {
      // 1. Load Stats
      const res = await fetch('/api/admin/dashboard');
      const json = await res.json();
      if (json.success) {
        const stats = json.data;
        document.getElementById('admin-revenue').textContent = "$" + stats.totalRevenue.toFixed(2);
        document.getElementById('admin-total-bookings').textContent = stats.totalBookings;
        document.getElementById('admin-occupancy').textContent = stats.occupancyRatePercent + "%";
        document.getElementById('admin-cancelled').textContent = stats.cancelledBookings;
      }

      // 2. Load Reservations Table
      loadAdminReservations();

      // 3. Load Audit Logs Table
      loadAdminAuditLogs();
    } catch (e) {
      console.warn("Admin loading error:", e);
    }
  }

  async function loadAdminReservations(query = '') {
    const tbody = document.getElementById('admin-reservations-tbody');
    if (!tbody) return;
    try {
      const res = await fetch(`/api/admin/reservations?query=${encodeURIComponent(query)}`);
      const json = await res.json();
      if (json.success) {
        tbody.innerHTML = '';
        json.data.forEach(r => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td><strong>${r.bookingReference}</strong></td>
            <td>${r.hotelName} (${r.roomTypeName})</td>
            <td>${r.guestName || r.guestEmail}</td>
            <td>${r.checkInDate} — ${r.checkOutDate}</td>
            <td><strong>$${r.totalAmount.toFixed(2)}</strong></td>
            <td><span class="status-badge ${r.status === 'CONFIRMED' ? 'status-confirmed' : (r.status === 'CANCELLED' ? 'status-cancelled' : 'status-pending')}">${r.status}</span></td>
            <td>
              <button class="btn btn-outline-gold btn-sm" onclick='App.showVoucherModal(${JSON.stringify(r).replace(/'/g, "&#39;")})'>Inspect</button>
            </td>
          `;
          tbody.appendChild(tr);
        });
      }
    } catch (e) {
      console.warn("Admin res error:", e);
    }
  }

  async function loadAdminAuditLogs() {
    const tbody = document.getElementById('admin-audit-tbody');
    if (!tbody) return;
    try {
      const res = await fetch('/api/admin/audit-logs');
      const json = await res.json();
      if (json.success) {
        tbody.innerHTML = '';
        json.data.slice(0, 15).forEach(log => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td><code>${log.action}</code></td>
            <td>${log.entityName} (${log.entityId || '-'})</td>
            <td>${log.performedBy}</td>
            <td style="font-size:0.8rem; color:#a0aec0;">${log.details}</td>
            <td style="font-size:0.75rem; color:#718096;">${new Date(log.timestamp).toLocaleString()}</td>
          `;
          tbody.appendChild(tr);
        });
      }
    } catch (e) {
      console.warn("Admin audit error:", e);
    }
  }

  /* ==========================================================================
     PRINTABLE / DOWNLOADABLE CONFIRMATION VOUCHER
     ========================================================================== */
  function showVoucherModal(resData) {
    document.getElementById('voucher-ref').textContent = resData.bookingReference;
    document.getElementById('voucher-hotel').textContent = resData.hotelName;
    document.getElementById('voucher-address').textContent = resData.hotelAddress + ", " + resData.hotelCity;
    document.getElementById('voucher-room').textContent = resData.roomTypeName + " • Room " + (resData.roomNumber || 'Standard Allocation');
    document.getElementById('voucher-guest').textContent = resData.guestName || state.currentUser?.fullName || 'Valued Guest';
    document.getElementById('voucher-email').textContent = resData.guestEmail || state.currentUser?.email || '';
    document.getElementById('voucher-checkin').textContent = resData.checkInDate;
    document.getElementById('voucher-checkout').textContent = resData.checkOutDate;
    document.getElementById('voucher-nights').textContent = resData.numberOfNights;
    document.getElementById('voucher-guests-count').textContent = resData.adults + " Adults";
    document.getElementById('voucher-total').textContent = "$" + resData.totalAmount.toFixed(2) + " " + resData.currency;
    document.getElementById('voucher-payment').textContent = (resData.paymentStatus || 'CONFIRMED') + " (" + resData.paymentMethod + ")";
    document.getElementById('voucher-status').textContent = resData.status;

    openModal(el.voucherModal);
  }

  function printVoucher() {
    window.print();
  }

  /* ==========================================================================
     POLICY MODALS (Terms & Privacy)
     ========================================================================== */
  async function openPolicyModal(type) {
    const titleEl = document.getElementById('policy-modal-title');
    const contentEl = document.getElementById('policy-modal-content');
    contentEl.innerHTML = '<div style="color:#d4af37;">Loading policy documentation...</div>';
    openModal(el.policyModal);

    try {
      const endpoint = type === 'privacy' ? '/api/policy/privacy' : '/api/policy/terms';
      const res = await fetch(endpoint);
      const json = await res.json();
      if (json.success) {
        titleEl.textContent = json.data.title;
        if (type === 'privacy') {
          contentEl.innerHTML = `
            <div style="font-size:0.92rem; line-height:1.7; color:#cbd5e0;">
              <p><strong>Version:</strong> ${json.data.version}</p>
              <h4 style="color:#d4af37; margin:1rem 0 0.4rem;">1. Information Collected</h4>
              <p>${json.data.dataCollected}</p>
              <h4 style="color:#d4af37; margin:1rem 0 0.4rem;">2. Purpose of Collection</h4>
              <p>${json.data.purpose}</p>
              <h4 style="color:#d4af37; margin:1rem 0 0.4rem;">3. Storage and Protection</h4>
              <p>${json.data.storage}</p>
              <h4 style="color:#d4af37; margin:1rem 0 0.4rem;">4. Retention & User Rights</h4>
              <p>${json.data.retention}</p>
              <p style="margin-top:1rem;">Contact: <code>${json.data.contact}</code></p>
            </div>
          `;
        } else {
          const s = json.data.sections;
          contentEl.innerHTML = `
            <div style="font-size:0.92rem; line-height:1.7; color:#cbd5e0;">
              <p><strong>Policy Version:</strong> ${json.data.version} | <strong>Updated:</strong> ${json.data.lastUpdated}</p>
              
              <h4 style="color:#d4af37; margin:1.2rem 0 0.4rem;">A. Reservation Accuracy</h4>
              <p>${s.reservationAccuracy}</p>
              
              <h4 style="color:#d4af37; margin:1.2rem 0 0.4rem;">B. Real-Time Availability</h4>
              <p>${s.availability}</p>
              
              <h4 style="color:#d4af37; margin:1.2rem 0 0.4rem;">C. Pricing, Taxes & Fees</h4>
              <p>${s.pricingAndTaxes}</p>
              
              <h4 style="color:#e5c378; margin:1.2rem 0 0.4rem;">D. Simulated Payment Notice</h4>
              <p style="background:rgba(212,175,55,0.1); padding:0.8rem; border-left:3px solid #d4af37; border-radius:4px;">${s.simulatedPaymentDisclosure}</p>
              
              <h4 style="color:#d4af37; margin:1.2rem 0 0.4rem;">E. Cancellation Policy & Refunds</h4>
              <p>${s.cancellationAndRefunds}</p>
              
              <h4 style="color:#d4af37; margin:1.2rem 0 0.4rem;">F. Check-in, Changes & No-Shows</h4>
              <p>${s.changesAndNoShows}</p>
              
              <h4 style="color:#d4af37; margin:1.2rem 0 0.4rem;">G. Account Security</h4>
              <p>${s.accountSecurity}</p>
              
              <h4 style="color:#d4af37; margin:1.2rem 0 0.4rem;">H. Demonstration Service Limitations</h4>
              <p>${s.serviceLimitations}</p>
            </div>
          `;
        }
      }
    } catch (e) {
      contentEl.innerHTML = `<div style="color:#fc8181;">Error retrieving policy details: ${e.message}</div>`;
    }
  }

  /* ==========================================================================
     NAVIGATION & UI UTILITIES
     ========================================================================== */
  function handleNavigation(navTarget) {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-nav') === navTarget) link.classList.add('active');
    });

    const homeView = document.getElementById('home-view');
    const resView = document.getElementById('reservations-view');
    const adminView = document.getElementById('admin-view');

    if (navTarget === 'home' || navTarget === 'explore') {
      if (homeView) homeView.style.display = 'block';
      if (resView) resView.style.display = 'none';
      if (adminView) adminView.style.display = 'none';
      if (navTarget === 'explore') {
        const sec = document.getElementById('showcase-section');
        if (sec) sec.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (navTarget === 'reservations') {
      if (!state.currentUser) {
        showNotification("Please sign in to view your reservations.", "info");
        openAuthModal();
        return;
      }
      if (homeView) homeView.style.display = 'none';
      if (resView) resView.style.display = 'block';
      if (adminView) adminView.style.display = 'none';
      loadUserReservations();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (navTarget === 'admin') {
      if (homeView) homeView.style.display = 'none';
      if (resView) resView.style.display = 'none';
      if (adminView) adminView.style.display = 'block';
      loadAdminDashboard();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (navTarget === 'offers') {
      showNotification("CodeAlpha Autumn Privilege: Enjoy complimentary champagne and spa credits on all Suite reservations.", "info");
    } else if (navTarget === 'help') {
      openPolicyModal('terms');
    }
  }

  function openModal(modalEl) {
    if (modalEl) modalEl.classList.add('active');
  }

  function closeModal(modalEl) {
    if (modalEl) {
      modalEl.classList.remove('active');
      if (modalEl === el.room3dModal) {
        Room3DViewer.cleanup();
      }
      if (modalEl === el.babyModal) {
        SleepingBabyViewer.cleanup();
      }
    }
  }

  function showNotification(msg, type = 'info') {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      z-index: 9999;
      background: rgba(14, 19, 31, 0.95);
      border: 1px solid ${type === 'error' ? '#e53e3e' : '#d4af37'};
      color: #fff;
      padding: 0.9rem 1.6rem;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.6);
      font-size: 0.92rem;
      display: flex;
      align-items: center;
      gap: 0.6rem;
      transform: translateY(20px);
      opacity: 0;
      transition: all 0.3s ease;
    `;
    toast.innerHTML = `<span>${type === 'error' ? '⚠️' : '✧'}</span> <span>${msg}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    }, 10);

    setTimeout(() => {
      toast.style.transform = 'translateY(20px)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }

  return {
    init,
    openAuthModal,
    handleDemoLogin,
    handleSendOtp,
    handleVerifyOtp,
    handleEmailLogin,
    handleLogout,
    open3dTour,
    openBookingModal,
    handleConfirmBooking,
    replayBabyAnimation,
    handleNavigation,
    showVoucherModal,
    openCancelModal,
    openPolicyModal,
    printVoucher,
    closeModal,
    loadAdminReservations
  };
})();

// Bootstrap when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

