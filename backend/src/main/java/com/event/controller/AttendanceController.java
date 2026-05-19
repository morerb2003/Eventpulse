package com.event.controller;

import com.event.dto.AttendanceDto;
import com.event.entity.User;
import com.event.service.AttendanceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @PostMapping("/{eventId}/checkin")
    public ResponseEntity<AttendanceDto> checkIn(
            @PathVariable Long eventId,
            @RequestParam String token,
            @RequestParam(required = false) String guestEmail,
            @AuthenticationPrincipal User user
    ) {
        Long userId = user != null ? user.getId() : null;
        return new ResponseEntity<>(attendanceService.checkIn(eventId, token, userId, guestEmail), HttpStatus.CREATED);
    }

    @PostMapping("/checkin-by-token")
    public ResponseEntity<AttendanceDto> checkInByToken(
            @RequestParam String token,
            @RequestParam(required = false) String guestEmail,
            @AuthenticationPrincipal User user
    ) {
        Long userId = user != null ? user.getId() : null;
        return new ResponseEntity<>(attendanceService.checkInByToken(token, userId, guestEmail), HttpStatus.CREATED);
    }

    @GetMapping("/{eventId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER')")
    public ResponseEntity<List<AttendanceDto>> getAttendanceByEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(attendanceService.getAttendanceByEvent(eventId));
    }

    @GetMapping("/{eventId}/count")
    public ResponseEntity<Long> countAttendance(@PathVariable Long eventId) {
        return ResponseEntity.ok(attendanceService.countAttendance(eventId));
    }
}
