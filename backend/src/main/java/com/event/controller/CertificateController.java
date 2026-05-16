package com.event.controller;

import com.event.entity.Booking;
import com.event.entity.Event;
import com.event.entity.User;
import com.event.repository.BookingRepository;
import com.event.repository.EventRepository;
import com.event.service.CertificateService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;

@RestController
@RequestMapping("/api/certificates")
@RequiredArgsConstructor
public class CertificateController {

    private final CertificateService certificateService;
    private final EventRepository eventRepository;
    private final BookingRepository bookingRepository;

    @GetMapping("/download/{eventId}")
    public ResponseEntity<InputStreamResource> downloadCertificate(
            @PathVariable Long eventId,
            @AuthenticationPrincipal User user) {
        
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        // Validate that the user has a completed booking for this event
        bookingRepository.findByEvent_IdAndUser_IdAndPaymentStatus(eventId, user.getId(), "COMPLETED")
                .orElseThrow(() -> new RuntimeException("You have not booked or completed payment for this event."));
        
        ByteArrayInputStream bis = certificateService.generateCertificate(user, event);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=certificate-" + eventId + ".pdf");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(bis));
    }
}
