package com.event.serviceImpl;

import com.event.entity.Booking;
import com.event.repository.BookingRepository;
import com.event.service.CheckInService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CheckInServiceImpl implements CheckInService {

    private final BookingRepository bookingRepository;

    @Override
    @Transactional
    public Booking processCheckin(String token) {
        if (token == null || token.isBlank()) {
            throw new RuntimeException("Check-in token is required");
        }

        Booking booking = bookingRepository.findByCheckInToken(token.trim())
                .orElseThrow(() -> new RuntimeException("Invalid check-in token"));

        if (!"COMPLETED".equalsIgnoreCase(booking.getPaymentStatus())) {
            throw new RuntimeException("Cannot check in. Payment status is " + booking.getPaymentStatus());
        }

        if (booking.isCheckedIn()) {
            throw new RuntimeException("Attendee is already checked in for this booking.");
        }

        booking.setCheckedIn(true);
        booking.setCheckedInAt(LocalDateTime.now());
        return bookingRepository.save(booking);
    }
}
