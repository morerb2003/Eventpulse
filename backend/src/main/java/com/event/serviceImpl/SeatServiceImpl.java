package com.event.serviceImpl;

import com.event.entity.Event;
import com.event.entity.Seat;
import com.event.repository.EventRepository;
import com.event.repository.SeatRepository;
import com.event.service.SeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SeatServiceImpl implements SeatService {

    private final SeatRepository seatRepository;
    private final EventRepository eventRepository;

    @Override
    public void initializeSeats(Event event) {
        List<Seat> seats = new ArrayList<>();
        int capacity = event.getCapacity() != null ? event.getCapacity() : 50;
        int rows = (int) Math.ceil(capacity / 10.0);
        
        for (int i = 0; i < capacity; i++) {
            char rowChar = (char) ('A' + (i / 10));
            int seatNum = (i % 10) + 1;
            
            Seat seat = Seat.builder()
                    .event(event)
                    .seatNumber(String.valueOf(seatNum))
                    .rowLabel(String.valueOf(rowChar))
                    .isBooked(false)
                    .build();
            seats.add(seat);
        }
        seatRepository.saveAll(seats);
    }

    @Override
    public List<Seat> getSeatsByEvent(Long eventId) {
        List<Seat> seats = seatRepository.findByEventId(eventId);
        if (seats.isEmpty()) {
            Event event = eventRepository.findById(eventId)
                    .orElseThrow(() -> new RuntimeException("Event not found"));
            initializeSeats(event);
            return seatRepository.findByEventId(eventId);
        }
        return seats;
    }
}
