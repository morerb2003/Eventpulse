package com.event.controller;

import com.event.dto.FeedbackDto;
import com.event.service.FeedbackService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping
    public ResponseEntity<FeedbackDto> submitFeedback(@RequestBody FeedbackDto feedbackDto) {
        return ResponseEntity.ok(feedbackService.submitFeedback(feedbackDto));
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<FeedbackDto>> getFeedbackByEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(feedbackService.getFeedbackByEvent(eventId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<FeedbackDto>> getFeedbackByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(feedbackService.getFeedbackByUser(userId));
    }
}
