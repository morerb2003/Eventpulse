package com.event.serviceImpl;

import com.event.entity.Booking;
import com.event.entity.Event;
import com.event.entity.Seat;
import com.event.entity.User;
import com.event.repository.BookingRepository;
import com.event.repository.EventRepository;
import com.event.repository.SeatRepository;
import com.event.repository.UserRepository;
import com.event.service.BookingService;
import com.event.service.CertificateService;
import com.event.service.EmailService;
import com.event.service.PaymentService;
import com.razorpay.Order;
import com.razorpay.RazorpayException;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final EventRepository eventRepository;
    private final SeatRepository seatRepository;
    private final UserRepository userRepository;
    private final PaymentService paymentService;
    private final EmailService emailService;
    private final CertificateService certificateService;

    @org.springframework.beans.factory.annotation.Value("${app.frontend-url}")
    private String frontendUrl;

    @Override
    @Transactional
    public Booking initiateBooking(Long eventId, Long userId, Long seatId, String gateway) throws RazorpayException, StripeException {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Seat seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new RuntimeException("Seat not found"));

        // Check if seat is already booked (finalized)
        if (seat.isBooked()) {
            throw new RuntimeException("Seat already booked");
        }

        // Check if seat has a pending booking that is not expired (e.g., 5 minutes)
        List<Booking> pendingBookings = bookingRepository.findBySeat_IdAndPaymentStatus(seatId, "PENDING");
        
        for (Booking b : pendingBookings) {
            if (b.getUser() != null && b.getUser().getId().equals(userId)) {
                // If same user has a pending booking, delete it to avoid constraint issues or clutter
                bookingRepository.delete(b);
            } else if (b.getBookingDate() != null && b.getBookingDate().isAfter(LocalDateTime.now().minusMinutes(5))) {
                // If different user and not expired, block
                throw new RuntimeException("Seat is temporarily reserved by another user. Please try again in a few minutes.");
            }
        }
        bookingRepository.flush(); // Ensure deletions are processed before saving new one

        // Check if user already has a completed booking for this event
        bookingRepository.findByEvent_IdAndUser_IdAndPaymentStatus(eventId, userId, "COMPLETED")
                .ifPresent(b -> { throw new RuntimeException("You have already booked a ticket for this event."); });

        // Check if event is in the past
        if (event.getDate() != null && event.getDate().isBefore(java.time.LocalDateTime.now())) {
            throw new RuntimeException("Cannot book tickets for past events.");
        }

        Double amount = event.getPrice() != null ? event.getPrice() : 0.0;

        Booking booking = Booking.builder()
                .event(event)
                .user(user)
                .seat(seat)
                .amount(amount)
                .paymentStatus("PENDING")
                .bookingDate(LocalDateTime.now())
                .build();

        if ("RAZORPAY".equalsIgnoreCase(gateway)) {
            Order order = paymentService.createRazorpayOrder(amount);
            booking.setRazorpayOrderId(order.get("id"));
        } else if ("STRIPE".equalsIgnoreCase(gateway)) {
            Session session = paymentService.createStripeSession(booking, 
                frontendUrl + "/payment-success", 
                frontendUrl + "/payment-cancel");
            booking.setStripeSessionId(session.getId());
        }

        return bookingRepository.save(booking);
    }

    @Override
    @Transactional
    public Booking completeBooking(String paymentId, String orderId, String signature, String gateway) {
        Booking booking;
        if ("RAZORPAY".equalsIgnoreCase(gateway)) {
            booking = bookingRepository.findByRazorpayOrderId(orderId)
                    .orElseThrow(() -> new RuntimeException("Booking not found"));
            
            boolean isValid = paymentService.verifyRazorpayPayment(orderId, paymentId, signature);
            if (!isValid) {
                booking.setPaymentStatus("FAILED");
                return bookingRepository.save(booking);
            }
        } else {
            booking = bookingRepository.findByStripeSessionId(orderId)
                    .orElseThrow(() -> new RuntimeException("Booking not found"));
        }

        return finalizeBooking(booking, paymentId);
    }

    private Booking finalizeBooking(Booking booking, String paymentId) {
        // Double check if seat is already booked by someone else who might have paid faster
        if (booking.getSeat().isBooked()) {
            booking.setPaymentStatus("FAILED");
            booking.setPaymentId(paymentId + "_REFUND_REQUIRED");
            return bookingRepository.save(booking);
        }

        booking.setPaymentStatus("COMPLETED");
        booking.setPaymentId(paymentId);
        
        Seat seat = booking.getSeat();
        seat.setBooked(true);
        seatRepository.save(seat);

        Event event = booking.getEvent();
        if (event.getAvailableSeats() > 0) {
            event.setAvailableSeats(event.getAvailableSeats() - 1);
            eventRepository.save(event);
        }

        try {
            byte[] pdfBytes = null;
            if (certificateService != null) {
                User user = booking.getUser();
                java.io.ByteArrayInputStream bis = certificateService.generateCertificate(user, event);
                pdfBytes = bis.readAllBytes();
            }

            emailService.sendEventNotification(
                booking.getUser().getEmail(), 
                booking.getUser().getFirstName(), 
                event.getTitle(), 
                event.getDate() != null ? event.getDate().toString() : "TBA",
                pdfBytes
            );
        } catch (Exception e) {
            System.err.println("Failed to send event notification email: " + e.getMessage());
        }

        return bookingRepository.save(booking);
    }

    @Override
    public List<Booking> getUserBookings(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    @Override
    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id).orElseThrow();
    }
}
