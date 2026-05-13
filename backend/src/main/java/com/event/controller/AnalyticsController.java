package com.event.controller;

import com.event.dto.EventAnalyticsDto;
import com.event.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/event/{eventId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventAnalyticsDto> getEventAnalytics(@PathVariable Long eventId) {
        return ResponseEntity.ok(analyticsService.getEventAnalytics(eventId));
    }

    @GetMapping("/global")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getGlobalStats() {
        return ResponseEntity.ok(analyticsService.getGlobalStats());
    }
}
