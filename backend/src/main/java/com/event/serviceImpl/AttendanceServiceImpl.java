package com.event.serviceImpl;

import com.event.dto.AttendanceDto;
import com.event.entity.Attendance;
import com.event.entity.Event;
import com.event.entity.User;
import com.event.exception.ResourceNotFoundException;
import com.event.repository.AttendanceRepository;
import com.event.repository.EventRepository;
import com.event.repository.UserRepository;
import com.event.service.AttendanceService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public AttendanceServiceImpl(AttendanceRepository attendanceRepository, 
                                 EventRepository eventRepository, 
                                 UserRepository userRepository) {
        this.attendanceRepository = attendanceRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }

    @Override
    public AttendanceDto checkIn(Long eventId, String token, Long userId, String guestEmail) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", eventId));

        if (!event.getQrToken().equals(token)) {
            throw new RuntimeException("Invalid check-in token.");
        }

        User user = null;
        if (userId != null) {
            user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
            
            if (attendanceRepository.existsByEventIdAndUserId(eventId, userId)) {
                throw new RuntimeException("You have already checked in for this event.");
            }
        } else if (guestEmail != null) {
            if (attendanceRepository.existsByEventIdAndGuestEmail(eventId, guestEmail)) {
                throw new RuntimeException("This email has already been used for check-in.");
            }
        } else {
            throw new RuntimeException("User identification required for check-in.");
        }

        Attendance attendance = Attendance.builder()
                .event(event)
                .user(user)
                .guestEmail(guestEmail)
                .checkedInAt(LocalDateTime.now())
                .method(Attendance.CheckInMethod.QR_SCAN)
                .build();

        Attendance savedAttendance = attendanceRepository.save(attendance);
        return mapToDto(savedAttendance);
    }

    @Override
    public AttendanceDto checkInByToken(String token, Long userId, String guestEmail) {
        Event event = eventRepository.findByQrToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired check-in token."));
        
        return checkIn(event.getId(), token, userId, guestEmail);
    }

    @Override
    public List<AttendanceDto> getAttendanceByEvent(Long eventId) {
        if (!eventRepository.existsById(eventId)) {
            throw new ResourceNotFoundException("Event", "id", eventId);
        }
        return attendanceRepository.findByEventId(eventId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public Long countAttendance(Long eventId) {
        return attendanceRepository.countByEventId(eventId);
    }

    private AttendanceDto mapToDto(Attendance attendance) {
        return AttendanceDto.builder()
                .id(attendance.getId())
                .eventId(attendance.getEvent().getId())
                .eventTitle(attendance.getEvent().getTitle())
                .userId(attendance.getUser() != null ? attendance.getUser().getId() : null)
                .userName(attendance.getUser() != null ? 
                         attendance.getUser().getFirstName() + " " + attendance.getUser().getLastName() : "Guest")
                .guestEmail(attendance.getGuestEmail())
                .checkedInAt(attendance.getCheckedInAt())
                .method(attendance.getMethod())
                .totalAttendees(attendanceRepository.countByEventId(attendance.getEvent().getId()))
                .build();
    }
}
