package com.event.service;

import com.event.dto.AttendanceDto;

import java.util.List;

public interface AttendanceService {

    /** Called when a QR code is scanned. Marks check-in. */
    AttendanceDto checkIn(Long eventId, String token, Long userId, String guestEmail);

    /** Called when a QR code is scanned using only the token. */
    AttendanceDto checkInByToken(String token, Long userId, String guestEmail);

    /** List all attendees for an event (admin view). */
    List<AttendanceDto> getAttendanceByEvent(Long eventId);

    /** Count attendees for an event. */
    Long countAttendance(Long eventId);
}
