package com.event.controller;

import com.event.entity.Booking;
import com.event.entity.Role;
import com.event.entity.Seat;
import com.event.entity.User;
import com.event.service.BookingService;
import com.event.service.SeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final SeatService seatService;

    @PostMapping("/initiate")
    public ResponseEntity<?> initiateBooking(@RequestBody Map<String, Object> request,
                                             @AuthenticationPrincipal User user) {
        try {
            if (user == null) {
                return ResponseEntity.status(401).body(Map.of("message", "Authentication required"));
            }
            Long eventId = Long.parseLong(request.get("eventId").toString());
            Long seatId = Long.parseLong(request.get("seatId").toString());
            Object gatewayObj = request.get("gateway");
            if (gatewayObj == null) {
                return ResponseEntity.badRequest().body("Payment gateway not specified.");
            }
            String gateway = gatewayObj.toString();

            Booking booking = bookingService.initiateBooking(eventId, user.getId(), seatId, gateway);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage() != null ? e.getMessage() : "An unexpected error occurred"));
        }
    }

    @PostMapping("/complete")
    public ResponseEntity<?> completeBooking(@RequestBody Map<String, String> request) {
        try {
            String paymentId = request.get("paymentId");
            String orderId = request.get("orderId");
            String signature = request.get("signature");
            String gateway = request.get("gateway");

            Booking booking = bookingService.completeBooking(paymentId, orderId, signature, gateway);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserBookings(@PathVariable Long userId,
                                             @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Authentication required"));
        }
        if (!user.getId().equals(userId) && user.getRole() != Role.ADMIN) {
            return ResponseEntity.status(403).body(Map.of("message", "You can only view your own bookings"));
        }
        return ResponseEntity.ok(bookingService.getUserBookings(userId));
    }

    @GetMapping("/event/{eventId}/seats")
    public ResponseEntity<List<Seat>> getEventSeats(@PathVariable Long eventId) {
        return ResponseEntity.ok(seatService.getSeatsByEvent(eventId));
    }
}
