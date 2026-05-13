package com.event.service;

import com.event.dto.EventAnalyticsDto;

public interface AnalyticsService {
    EventAnalyticsDto getEventAnalytics(Long eventId);
    java.util.Map<String, Object> getGlobalStats();
}
