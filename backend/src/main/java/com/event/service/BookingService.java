package com.event.service;

import com.event.entity.Booking;
import com.razorpay.RazorpayException;
import com.stripe.exception.StripeException;
import java.util.List;

public interface BookingService {
    Booking initiateBooking(Long eventId, Long userId, Long seatId, String gateway) throws RazorpayException, StripeException;
    Booking completeBooking(String paymentId, String orderId, String signature, String gateway);
    List<Booking> getUserBookings(Long userId);
    Booking getBookingById(Long id);
}
