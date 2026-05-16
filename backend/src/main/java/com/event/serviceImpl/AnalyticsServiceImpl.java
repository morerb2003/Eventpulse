package com.event.serviceImpl;

import com.event.dto.EventAnalyticsDto;
import com.event.entity.Event;
import com.event.entity.Feedback;
import com.event.exception.ResourceNotFoundException;
import com.event.repository.BookingRepository;
import com.event.repository.EventRepository;
import com.event.repository.FeedbackRepository;
import com.event.repository.UserRepository;
import com.event.service.AnalyticsService;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    private final EventRepository eventRepository;
    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    public AnalyticsServiceImpl(EventRepository eventRepository, FeedbackRepository feedbackRepository, 
                                UserRepository userRepository, BookingRepository bookingRepository) {
        this.eventRepository = eventRepository;
        this.feedbackRepository = feedbackRepository;
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
    }

    @Override
    public EventAnalyticsDto getEventAnalytics(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", eventId));

        List<Feedback> feedbacks = feedbackRepository.findByEventId(eventId);
        
        long totalFeedbacks = feedbacks.size();
        double averageRating = feedbacks.stream()
                .mapToInt(Feedback::getRating)
                .average()
                .orElse(0.0);

        Map<Integer, Long> ratingDistribution = feedbacks.stream()
                .collect(Collectors.groupingBy(Feedback::getRating, Collectors.counting()));

        Map<String, Long> sentimentDistribution = feedbacks.stream()
                .filter(f -> f.getSentiment() != null)
                .collect(Collectors.groupingBy(Feedback::getSentiment, Collectors.counting()));

        List<com.event.entity.Booking> bookings = bookingRepository.findByEventId(eventId);
        long totalBookings = bookings.stream().filter(b -> "COMPLETED".equals(b.getPaymentStatus())).count();
        double totalRevenue = bookings.stream()
                .filter(b -> "COMPLETED".equals(b.getPaymentStatus()))
                .mapToDouble(com.event.entity.Booking::getAmount)
                .sum();

        return EventAnalyticsDto.builder()
                .eventId(eventId)
                .eventTitle(event.getTitle())
                .totalFeedbacks(totalFeedbacks)
                .averageRating(averageRating)
                .ratingDistribution(ratingDistribution)
                .sentimentDistribution(sentimentDistribution)
                .totalBookings(totalBookings)
                .totalRevenue(totalRevenue)
                .build();
    }

    @Override
    public Map<String, Object> getGlobalStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalEvents", eventRepository.count());
        stats.put("totalUsers", userRepository.count());
        stats.put("totalFeedbacks", feedbackRepository.count());
        
        double globalRevenue = bookingRepository.findAll().stream()
                .filter(b -> "COMPLETED".equals(b.getPaymentStatus()))
                .mapToDouble(com.event.entity.Booking::getAmount)
                .sum();
        stats.put("totalRevenue", globalRevenue);
        return stats;
    }
}
