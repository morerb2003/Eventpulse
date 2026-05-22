package com.event.serviceImpl;

import com.event.dto.FeedbackDto;
import com.event.entity.Event;
import com.event.entity.Feedback;
import com.event.entity.User;
import com.event.exception.ResourceNotFoundException;
import com.event.repository.EventRepository;
import com.event.repository.FeedbackRepository;
import com.event.repository.UserRepository;
import com.event.service.CertificateService;
import com.event.service.EmailService;
import com.event.service.FeedbackService;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeedbackServiceImpl implements FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final CertificateService certificateService;
    private final SimpMessagingTemplate messagingTemplate;

    // Production innovation: Spam Keywords
    private static final List<String> SPAM_KEYWORDS = Arrays.asList("win free", "click here", "buy now", "subscribe", "crypto", "cheap");

    public FeedbackServiceImpl(FeedbackRepository feedbackRepository, 
                               EventRepository eventRepository, 
                               UserRepository userRepository,
                               EmailService emailService,
                               CertificateService certificateService,
                               SimpMessagingTemplate messagingTemplate) {
        this.feedbackRepository = feedbackRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.certificateService = certificateService;
        this.messagingTemplate = messagingTemplate;
    }

    @Override
    public FeedbackDto submitFeedback(FeedbackDto feedbackDto) {
        // Innovation: Spam Detection
        if (isSpam(feedbackDto.getComments())) {
            throw new RuntimeException("Feedback rejected: Potential spam detected.");
        }

        Event event = eventRepository.findById(feedbackDto.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", feedbackDto.getEventId()));
        
        User user = null;
        if (feedbackDto.getUserId() != null) {
            user = userRepository.findById(feedbackDto.getUserId())
                    .orElse(null);
        }

        String sentiment = analyzeSentiment(feedbackDto.getRating(), feedbackDto.getComments());

        Feedback feedback = Feedback.builder()
                .comments(feedbackDto.getComments())
                .rating(feedbackDto.getRating())
                .user(user)
                .event(event)
                .sentiment(sentiment)
                .build();
        
        Feedback savedFeedback = feedbackRepository.save(feedback);
        
        if (user != null) {
            emailService.sendFeedbackConfirmation(user.getEmail(), user.getFirstName(), event.getTitle());
            
            try {
                if (certificateService != null) {
                    java.io.ByteArrayInputStream bis = certificateService.generateCertificate(user, event);
                    byte[] certBytes = bis.readAllBytes();
                    emailService.sendCertificateEmail(user.getEmail(), user.getFirstName(), event.getTitle(), certBytes);
                }
            } catch (Exception e) {
                System.err.println("Failed to automatically email certificate on feedback submission: " + e.getMessage());
            }
        }

        // Real-time Notification
        messagingTemplate.convertAndSend("/topic/feedback", "New feedback submitted for event: " + event.getTitle());
        
        return mapToDto(savedFeedback);
    }

    @Override
    public List<FeedbackDto> getFeedbackByEvent(Long eventId) {
        if (!eventRepository.existsById(eventId)) {
            throw new ResourceNotFoundException("Event", "id", eventId);
        }
        return feedbackRepository.findByEventId(eventId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<FeedbackDto> getFeedbackByUser(Long userId) {
        return feedbackRepository.findByUserId(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private boolean isSpam(String comments) {
        String lowerComments = comments.toLowerCase();
        return SPAM_KEYWORDS.stream().anyMatch(lowerComments::contains);
    }

    private String analyzeSentiment(int rating, String comments) {
        // Advanced logic: Prioritize rating but refine with text analysis
        String lowerComments = comments.toLowerCase();
        
        boolean hasPositiveWords = lowerComments.contains("good") || lowerComments.contains("great") || 
                                  lowerComments.contains("excellent") || lowerComments.contains("amazing") ||
                                  lowerComments.contains("wonderful") || lowerComments.contains("best");
                                  
        boolean hasNegativeWords = lowerComments.contains("bad") || lowerComments.contains("poor") || 
                                  lowerComments.contains("disappointed") || lowerComments.contains("worst") ||
                                  lowerComments.contains("horrible") || lowerComments.contains("slow");

        if (rating >= 4) {
            return hasNegativeWords ? "NEUTRAL" : "POSITIVE";
        }
        if (rating <= 2) {
            return hasPositiveWords ? "NEUTRAL" : "NEGATIVE";
        }
        
        if (hasPositiveWords && !hasNegativeWords) return "POSITIVE";
        if (hasNegativeWords && !hasPositiveWords) return "NEGATIVE";
        
        return "NEUTRAL";
    }

    private FeedbackDto mapToDto(Feedback feedback) {
        return FeedbackDto.builder()
                .id(feedback.getId())
                .comments(feedback.getComments())
                .rating(feedback.getRating())
                .userId(feedback.getUser() != null ? feedback.getUser().getId() : null)
                .eventId(feedback.getEvent().getId())
                .createdAt(feedback.getCreatedAt())
                .sentiment(feedback.getSentiment())
                .build();
    }
}
