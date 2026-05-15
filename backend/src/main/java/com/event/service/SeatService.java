package com.event.service;

import com.event.entity.Event;
import com.event.entity.Seat;
import java.util.List;

public interface SeatService {
    void initializeSeats(Event event);
    List<Seat> getSeatsByEvent(Long eventId);
}
