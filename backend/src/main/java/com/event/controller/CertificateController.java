package com.event.controller;

import com.event.entity.Event;
import com.event.entity.User;
import com.event.repository.EventRepository;
import com.event.repository.UserRepository;
import com.event.service.CertificateService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;

@RestController
@RequestMapping("/api/certificates")
@RequiredArgsConstructor
public class CertificateController {

    private final CertificateService certificateService;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    @GetMapping("/download/{eventId}/{userId}")
    public ResponseEntity<InputStreamResource> downloadCertificate(
            @PathVariable Long eventId,
            @PathVariable Long userId) {
        
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Here we could add a check if the user actually attended/paid for the event
        
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
