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

    @Override
    @Transactional
    public Booking initiateBooking(Long eventId, Long userId, Long seatId, String gateway) throws RazorpayException, StripeException {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Seat seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new RuntimeException("Seat not found"));

        if (seat.isBooked()) {
            throw new RuntimeException("Seat already booked");
        }

        Booking booking = Booking.builder()
                .event(event)
                .user(user)
                .seat(seat)
                .amount(event.getPrice())
                .paymentStatus("PENDING")
                .bookingDate(LocalDateTime.now())
                .build();

        if ("RAZORPAY".equalsIgnoreCase(gateway)) {
            Order order = paymentService.createRazorpayOrder(event.getPrice());
            booking.setRazorpayOrderId(order.get("id"));
        } else if ("STRIPE".equalsIgnoreCase(gateway)) {
            Session session = paymentService.createStripeSession(booking, "http://localhost:5173/payment-success", "http://localhost:5173/payment-cancel");
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
            if (isValid) {
                booking.setPaymentStatus("COMPLETED");
                booking.setPaymentId(paymentId);
                
                Seat seat = booking.getSeat();
                seat.setBooked(true);
                seatRepository.save(seat);

                Event event = booking.getEvent();
                event.setAvailableSeats(event.getAvailableSeats() - 1);
                eventRepository.save(event);
            } else {
                booking.setPaymentStatus("FAILED");
            }
        } else {
            // Stripe handling would typically be via webhook, but for mini platform we can check session status
            booking = bookingRepository.findByStripeSessionId(orderId) // orderId is sessionId for Stripe here
                    .orElseThrow(() -> new RuntimeException("Booking not found"));
            booking.setPaymentStatus("COMPLETED");
            booking.setPaymentId(paymentId);
            
            Seat seat = booking.getSeat();
            seat.setBooked(true);
            seatRepository.save(seat);

            Event event = booking.getEvent();
            event.setAvailableSeats(event.getAvailableSeats() - 1);
            eventRepository.save(event);
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
