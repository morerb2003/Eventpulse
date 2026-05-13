package com.event.mapper;

import com.event.dto.EventDto;
import com.event.dto.FeedbackDto;
import com.event.entity.Event;
import com.event.entity.Feedback;
import org.springframework.stereotype.Component;

@Component
public class EntityMapper {

    public EventDto toEventDto(Event event) {
        return EventDto.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .location(event.getLocation())
                .date(event.getDate())
                .category(event.getCategory())
                .posterUrl(event.getPosterUrl())
                .capacity(event.getCapacity())
                .startTime(event.getStartTime())
                .createdAt(event.getCreatedAt())
                .updatedAt(event.getUpdatedAt())
                .build();
    }

    public FeedbackDto toFeedbackDto(Feedback feedback) {
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
