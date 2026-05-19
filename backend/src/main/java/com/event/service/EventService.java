package com.event.service;

import com.event.dto.EventDto;
import com.event.dto.PaginatedResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

public interface EventService {
    EventDto createEvent(EventDto eventDto, MultipartFile poster);
    EventDto updateEvent(Long id, EventDto eventDto, MultipartFile poster);
    void deleteEvent(Long id);
    EventDto getEventById(Long id);
    PaginatedResponse<EventDto> getAllEvents(int pageNo, int pageSize, String sortBy, String sortDir);
    Map<String, String> getEventQrCode(Long id);
}
