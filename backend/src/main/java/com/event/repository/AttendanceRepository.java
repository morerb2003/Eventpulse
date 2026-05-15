package com.event.repository;

import com.event.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findByEventId(Long eventId);

    Optional<Attendance> findByEventIdAndUserId(Long eventId, Long userId);

    boolean existsByEventIdAndUserId(Long eventId, Long userId);

    boolean existsByEventIdAndGuestEmail(Long eventId, String guestEmail);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.event.id = :eventId")
    Long countByEventId(Long eventId);
}
