package com.event.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
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
    private String qrToken;
    private String qrCodeBase64;
    private Double price;
    private Integer availableSeats;
}
