package com.event.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeedbackDto {
    private Long id;
    private String comments;
    private Integer rating;
    private Long userId;
    private Long eventId;
    private LocalDateTime createdAt;
    private String sentiment;
}
