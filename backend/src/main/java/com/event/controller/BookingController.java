package com.event.controller;

import com.event.entity.Booking;
import com.event.entity.Seat;
import com.event.service.BookingService;
import com.event.service.SeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<?> initiateBooking(@RequestBody Map<String, Object> request) {
        try {
            Long eventId = Long.parseLong(request.get("eventId").toString());
            Long userId = Long.parseLong(request.get("userId").toString());
            Long seatId = Long.parseLong(request.get("seatId").toString());
            String gateway = request.get("gateway").toString();

            Booking booking = bookingService.initiateBooking(eventId, userId, seatId, gateway);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
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
    public ResponseEntity<List<Booking>> getUserBookings(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingService.getUserBookings(userId));
    }

    @GetMapping("/event/{eventId}/seats")
    public ResponseEntity<List<Seat>> getEventSeats(@PathVariable Long eventId) {
        return ResponseEntity.ok(seatService.getSeatsByEvent(eventId));
    }
}
