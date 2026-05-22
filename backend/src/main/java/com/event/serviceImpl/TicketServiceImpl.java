package com.event.serviceImpl;

import com.event.entity.Booking;
import com.event.entity.Event;
import com.event.entity.Seat;
import com.event.entity.User;
import com.event.service.TicketService;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import com.lowagie.text.pdf.draw.LineSeparator;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.Base64;

@Service
public class TicketServiceImpl implements TicketService {

    @Override
    public ByteArrayInputStream generateTicketPdf(Booking booking) {
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Font Definitions
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 28, Color.DARK_GRAY);
            Font sectionTitleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16, new Color(14, 165, 233)); // Info Color
            Font textFont = FontFactory.getFont(FontFactory.HELVETICA, 12, Color.BLACK);
            Font labelFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.GRAY);
            Font footerFont = FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 9, Color.LIGHT_GRAY);

            // Spacer
            document.add(new Paragraph("\n"));

            // Ticket Header
            Paragraph title = new Paragraph("OFFICIAL EVENT TICKET", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            Paragraph subtitle = new Paragraph("EventPulse Platform", FontFactory.getFont(FontFactory.HELVETICA, 12, Color.GRAY));
            subtitle.setAlignment(Element.ALIGN_CENTER);
            document.add(subtitle);

            document.add(new Paragraph("\n"));
            LineSeparator ls = new LineSeparator();
            ls.setLineColor(new Color(220, 220, 220));
            document.add(ls);
            document.add(new Paragraph("\n"));

            Event event = booking.getEvent();
            User user = booking.getUser();
            Seat seat = booking.getSeat();

            // Event Details Section
            Paragraph secEvent = new Paragraph("EVENT DETAILS", sectionTitleFont);
            document.add(secEvent);
            document.add(new Paragraph("\n"));

            Paragraph pEventTitle = new Paragraph();
            pEventTitle.add(new Chunk("Event Name: ", labelFont));
            pEventTitle.add(new Chunk(event.getTitle(), textFont));
            document.add(pEventTitle);

            Paragraph pEventDate = new Paragraph();
            pEventDate.add(new Chunk("Date & Time: ", labelFont));
            String dateStr = event.getDate() != null ? event.getDate().format(DateTimeFormatter.ofPattern("MMMM dd, yyyy - hh:mm a")) : "TBA";
            pEventDate.add(new Chunk(dateStr, textFont));
            document.add(pEventDate);

            Paragraph pEventLoc = new Paragraph();
            pEventLoc.add(new Chunk("Venue: ", labelFont));
            pEventLoc.add(new Chunk(event.getLocation() != null ? event.getLocation() : "Online / Virtual", textFont));
            document.add(pEventLoc);

            document.add(new Paragraph("\n"));
            document.add(ls);
            document.add(new Paragraph("\n"));

            // Attendee Details Section
            Paragraph secAttendee = new Paragraph("ATTENDEE & BOOKING INFO", sectionTitleFont);
            document.add(secAttendee);
            document.add(new Paragraph("\n"));

            Paragraph pAttendeeName = new Paragraph();
            pAttendeeName.add(new Chunk("Attendee Name: ", labelFont));
            pAttendeeName.add(new Chunk(user.getFirstName() + " " + user.getLastName(), textFont));
            document.add(pAttendeeName);

            Paragraph pAttendeeEmail = new Paragraph();
            pAttendeeEmail.add(new Chunk("Email Address: ", labelFont));
            pAttendeeEmail.add(new Chunk(user.getEmail(), textFont));
            document.add(pAttendeeEmail);

            Paragraph pBookingRef = new Paragraph();
            pBookingRef.add(new Chunk("Booking Reference: ", labelFont));
            pBookingRef.add(new Chunk("EP-BOOKING-" + booking.getId(), textFont));
            document.add(pBookingRef);

            Paragraph pSeatInfo = new Paragraph();
            pSeatInfo.add(new Chunk("Seat Assignment: ", labelFont));
            String seatStr = seat != null ? (seat.getRowLabel() + seat.getSeatNumber()) : "General Admission / Standard";
            pSeatInfo.add(new Chunk(seatStr, textFont));
            document.add(pSeatInfo);

            Paragraph pPrice = new Paragraph();
            pPrice.add(new Chunk("Amount Paid: ", labelFont));
            pPrice.add(new Chunk("$" + String.format("%.2f", booking.getAmount()), textFont));
            document.add(pPrice);

            document.add(new Paragraph("\n"));
            document.add(ls);
            document.add(new Paragraph("\n"));

            // QR Code Section
            if (booking.getQrCodeImage() != null && booking.getQrCodeImage().contains(",")) {
                try {
                    String base64Image = booking.getQrCodeImage().split(",")[1];
                    byte[] imageBytes = Base64.getDecoder().decode(base64Image);
                    Image qrImage = Image.getInstance(imageBytes);
                    qrImage.scaleToFit(140, 140);
                    qrImage.setAlignment(Element.ALIGN_CENTER);
                    document.add(qrImage);

                    Paragraph qrLabel = new Paragraph("Scan this code at the venue entrance", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.GRAY));
                    qrLabel.setAlignment(Element.ALIGN_CENTER);
                    document.add(qrLabel);
                } catch (Exception e) {
                    System.err.println("Failed to embed QR Code in Ticket PDF: " + e.getMessage());
                }
            }

            document.add(new Paragraph("\n\n"));
            Paragraph pFooter = new Paragraph("Generated by EventPulse | Please print or save this ticket on your mobile device.", footerFont);
            pFooter.setAlignment(Element.ALIGN_CENTER);
            document.add(pFooter);

            document.close();
        } catch (DocumentException e) {
            e.printStackTrace();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }
}
