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
public class EventDto {
    private Long id;
    private String title;
    private String description;
    private String location;
    private LocalDateTime date;
    private Long creatorId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // New Production Fields
    private String category;
    private String posterUrl;
    private Integer capacity;
    private LocalDateTime startTime;
}
