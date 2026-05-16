package com.event.repository;

import com.event.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);
    List<Booking> findByEventId(Long eventId);
    Optional<Booking> findByRazorpayOrderId(String razorpayOrderId);
    Optional<Booking> findByStripeSessionId(String stripeSessionId);
    Optional<Booking> findByEvent_IdAndUser_IdAndPaymentStatus(Long eventId, Long userId, String paymentStatus);
    List<Booking> findBySeat_IdAndPaymentStatus(Long seatId, String paymentStatus);
}
