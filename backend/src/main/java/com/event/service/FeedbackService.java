package com.event.service;

import com.event.dto.FeedbackDto;
import java.util.List;

public interface FeedbackService {
    FeedbackDto submitFeedback(FeedbackDto feedbackDto);
    List<FeedbackDto> getFeedbackByEvent(Long eventId);
    List<FeedbackDto> getFeedbackByUser(Long userId);
}
