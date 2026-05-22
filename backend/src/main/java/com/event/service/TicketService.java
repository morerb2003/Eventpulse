package com.event.service;

import com.event.entity.Booking;
import java.io.ByteArrayInputStream;

public interface TicketService {
    ByteArrayInputStream generateTicketPdf(Booking booking);
}
