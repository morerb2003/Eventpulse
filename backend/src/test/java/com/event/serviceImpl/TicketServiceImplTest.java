package com.event.serviceImpl;

import com.event.entity.Booking;
import com.event.entity.Event;
import com.event.entity.Seat;
import com.event.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.io.ByteArrayInputStream;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class TicketServiceImplTest {

    private TicketServiceImpl ticketService;

    @BeforeEach
    void setUp() {
        ticketService = new TicketServiceImpl();
    }

    @Test
    void generateTicketPdf_ShouldReturnValidPdfInputStream() throws Exception {
        // Arrange
        User user = User.builder()
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .build();

        Event event = Event.builder()
                .title("Spring Boot Masterclass")
                .date(LocalDateTime.now().plusDays(5))
                .location("Virtual Conference Center")
                .price(99.99)
                .build();

        Seat seat = Seat.builder()
                .rowLabel("A")
                .seatNumber("12")
                .build();

        Booking booking = Booking.builder()
                .id(42L)
                .user(user)
                .event(event)
                .seat(seat)
                .amount(99.99)
                .qrCodeImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=")
                .build();

        // Act
        ByteArrayInputStream bis = ticketService.generateTicketPdf(booking);

        // Assert
        assertNotNull(bis, "Should return a non-null input stream");
        byte[] pdfBytes = bis.readAllBytes();
        assertTrue(pdfBytes.length > 0, "PDF byte array should not be empty");
        
        // PDF headers usually start with %PDF
        String pdfHeader = new String(pdfBytes, 0, Math.min(pdfBytes.length, 4));
        assertEquals("%PDF", pdfHeader);
    }

    private void assertEquals(String expected, String actual) {
        org.junit.jupiter.api.Assertions.assertEquals(expected, actual);
    }
}
