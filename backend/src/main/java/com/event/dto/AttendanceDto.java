package com.event.dto;

import com.event.entity.Attendance.CheckInMethod;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceDto {
    private Long id;
    private Long eventId;
    private String eventTitle;
    private Long userId;
    private String userName;
    private String guestEmail;
    private LocalDateTime checkedInAt;
    private CheckInMethod method;
    private Long totalAttendees;   // populated in list responses
}
