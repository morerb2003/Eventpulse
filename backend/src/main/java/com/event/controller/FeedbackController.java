package com.event.controller;

import com.event.dto.FeedbackDto;
import com.event.entity.Role;
import com.event.entity.User;
import com.event.service.FeedbackService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping
    public ResponseEntity<?> submitFeedback(@RequestBody FeedbackDto feedbackDto,
                                            @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Authentication required"));
        }
        feedbackDto.setUserId(user.getId());
        return ResponseEntity.ok(feedbackService.submitFeedback(feedbackDto));
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<FeedbackDto>> getFeedbackByEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(feedbackService.getFeedbackByEvent(eventId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getFeedbackByUser(@PathVariable Long userId,
                                               @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Authentication required"));
        }
        if (!user.getId().equals(userId) && user.getRole() != Role.ADMIN) {
            return ResponseEntity.status(403).body(Map.of("message", "You can only view your own feedback"));
        }
        return ResponseEntity.ok(feedbackService.getFeedbackByUser(userId));
    }
}
