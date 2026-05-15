package com.event.serviceImpl;

import com.event.dto.EventDto;
import com.event.dto.PaginatedResponse;
import com.event.entity.Event;
import com.event.exception.ResourceNotFoundException;
import com.event.repository.EventRepository;
import com.event.service.EventService;
import com.event.service.FileService;
import com.event.entity.User;
import com.event.repository.UserRepository;
import com.event.service.SeatService;
import com.event.util.QRCodeGenerator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;
    private final FileService fileService;
    private final UserRepository userRepository;
    private final QRCodeGenerator qrCodeGenerator;
    private final SeatService seatService;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    public EventServiceImpl(EventRepository eventRepository, FileService fileService,
                            UserRepository userRepository, QRCodeGenerator qrCodeGenerator,
                            SeatService seatService) {
        this.eventRepository = eventRepository;
        this.fileService = fileService;
        this.userRepository = userRepository;
        this.qrCodeGenerator = qrCodeGenerator;
        this.seatService = seatService;
    }

    @Override
    public EventDto createEvent(EventDto eventDto, MultipartFile poster) {
        String posterUrl = null;
        if (poster != null && !poster.isEmpty()) {
            try {
                posterUrl = "/api/files/view/" + fileService.uploadFile(poster, "posters");
            } catch (Exception e) {
                throw new RuntimeException("Failed to upload poster");
            }
        }

        // Set creator from current security context
        org.springframework.security.core.Authentication authentication = 
            org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        User creator = null;
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            creator = (User) authentication.getPrincipal();
        }

        // Generate QR token & check-in URL
        String qrToken = qrCodeGenerator.generateToken();
        String checkInUrl = frontendUrl + "/checkin/" + qrToken;
        String qrCodeBase64 = qrCodeGenerator.generateQRCodeBase64(checkInUrl);

        Event event = Event.builder()
                .title(eventDto.getTitle())
                .description(eventDto.getDescription())
                .location(eventDto.getLocation())
                .date(eventDto.getDate())
                .category(eventDto.getCategory())
                .capacity(eventDto.getCapacity())
                .availableSeats(eventDto.getCapacity())
                .price(eventDto.getPrice())
                .startTime(eventDto.getStartTime())
                .posterUrl(posterUrl)
                .creator(creator)
                .qrToken(qrToken)
                .qrCodeBase64(qrCodeBase64)
                .build();
        
        Event savedEvent = eventRepository.save(event);
        seatService.initializeSeats(savedEvent);
        return mapToDto(savedEvent);
    }

    @Override
    public EventDto updateEvent(Long id, EventDto eventDto, MultipartFile poster) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", id));
        
        if (poster != null && !poster.isEmpty()) {
            try {
                if (event.getPosterUrl() != null) {
                    fileService.deleteFile(event.getPosterUrl().replace("/api/files/view/", ""));
                }
                String posterUrl = "/api/files/view/" + fileService.uploadFile(poster, "posters");
                event.setPosterUrl(posterUrl);
            } catch (Exception e) {
                throw new RuntimeException("Failed to upload poster");
            }
        }

        event.setTitle(eventDto.getTitle());
        event.setDescription(eventDto.getDescription());
        event.setLocation(eventDto.getLocation());
        event.setDate(eventDto.getDate());
        event.setCategory(eventDto.getCategory());
        event.setCapacity(eventDto.getCapacity());
        event.setPrice(eventDto.getPrice());
        event.setStartTime(eventDto.getStartTime());
        
        Event updatedEvent = eventRepository.save(event);
        return mapToDto(updatedEvent);
    }

    @Override
    public void deleteEvent(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", id));
        if (event.getPosterUrl() != null) {
            fileService.deleteFile(event.getPosterUrl().replace("/api/files/view/", ""));
        }
        eventRepository.delete(event);
    }

    @Override
    public EventDto getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", id));
        return mapToDto(event);
    }

    @Override
    public PaginatedResponse<EventDto> getAllEvents(int pageNo, int pageSize, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
        Page<Event> eventsPage = eventRepository.findAll(pageable);

        List<EventDto> content = eventsPage.getContent().stream().map(this::mapToDto).collect(Collectors.toList());

        return PaginatedResponse.<EventDto>builder()
                .content(content)
                .pageNo(eventsPage.getNumber())
                .pageSize(eventsPage.getSize())
                .totalElements(eventsPage.getTotalElements())
                .totalPages(eventsPage.getTotalPages())
                .last(eventsPage.isLast())
                .build();
    }

    private EventDto mapToDto(Event event) {
        return EventDto.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .location(event.getLocation())
                .date(event.getDate())
                .createdAt(event.getCreatedAt())
                .updatedAt(event.getUpdatedAt())
                .creatorId(event.getCreator() != null ? event.getCreator().getId() : null)
                .category(event.getCategory())
                .posterUrl(event.getPosterUrl())
                .capacity(event.getCapacity())
                .startTime(event.getStartTime())
                .qrToken(event.getQrToken())
                .qrCodeBase64(event.getQrCodeBase64())
                .price(event.getPrice())
                .availableSeats(event.getAvailableSeats())
                .build();
    }
}
