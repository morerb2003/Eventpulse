package com.event.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventAnalyticsDto {
    private Long eventId;
    private String eventTitle;
    private long totalFeedbacks;
    private double averageRating;
    private Map<Integer, Long> ratingDistribution;
    private Map<String, Long> sentimentDistribution;
    private long totalBookings;
    private double totalRevenue;
}
