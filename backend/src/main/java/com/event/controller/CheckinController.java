package com.event.controller;

import com.event.entity.Booking;
import com.event.service.CheckInService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/checkin")
@RequiredArgsConstructor
public class CheckinController {

    private final CheckInService checkInService;

    @PostMapping("/scan")
    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER')")
    public ResponseEntity<?> scanCheckIn(
            @RequestParam(required = false) String token,
            @RequestBody(required = false) Map<String, Object> request
    ) {
        try {
            String checkInToken = token;
            if ((checkInToken == null || checkInToken.isBlank()) && request != null) {
                Object tokenObj = request.get("token");
                if (tokenObj == null) {
                    tokenObj = request.get("checkInToken");
                }
                checkInToken = tokenObj != null ? tokenObj.toString() : null;
            }

            Booking booking = checkInService.processCheckin(checkInToken);
            String attendeeName = (booking.getUser().getFirstName() + " " + booking.getUser().getLastName()).trim();
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Check-in successful!",
                "bookingId", booking.getId(),
                "attendeeName", attendeeName,
                "userName", attendeeName,
                "eventTitle", booking.getEvent().getTitle(),
                "seatNumber", booking.getSeat() != null ? booking.getSeat().getSeatNumber() : "N/A",
                "checkedInAt", booking.getCheckedInAt()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage() != null ? e.getMessage() : "Check-in failed"
            ));
        }
    }
}
