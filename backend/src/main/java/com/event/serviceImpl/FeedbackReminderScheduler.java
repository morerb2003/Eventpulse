package com.event.serviceImpl;

import com.event.entity.Booking;
import com.event.entity.Event;
import com.event.repository.BookingRepository;
import com.event.repository.EventRepository;
import com.event.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedbackReminderScheduler {

    private final EventRepository eventRepository;
    private final BookingRepository bookingRepository;
    private final EmailService emailService;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    // Run every day at 10:00 AM
    @Scheduled(cron = "0 0 10 * * ?")
    public void sendFeedbackReminders() {
        LocalDateTime now = LocalDateTime.now();
        // Look for events that ended between 48 hours ago and 24 hours ago
        LocalDateTime start = now.minusDays(2);
        LocalDateTime end = now.minusDays(1);

        List<Event> recentEvents = eventRepository.findByDateBetween(start, end);

        for (Event event : recentEvents) {
            List<Booking> bookings = bookingRepository.findByEventId(event.getId());
            for (Booking booking : bookings) {
                if ("COMPLETED".equalsIgnoreCase(booking.getPaymentStatus())) {
                    String feedbackLink = frontendUrl + "/feedback/submit/" + event.getId();
                    try {
                        emailService.sendFeedbackReminder(
                            booking.getUser().getEmail(),
                            booking.getUser().getFirstName(),
                            event.getTitle(),
                            feedbackLink
                        );
                    } catch (Exception e) {
                        System.err.println("Error sending reminder to " + booking.getUser().getEmail());
                    }
                }
            }
        }
    }
}
