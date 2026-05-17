package com.event.repository;
import java.util.List;
import java.util.Optional;

import com.event.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    Optional<Event> findByQrToken(String qrToken);
    List<Event> findByDateBetween(java.time.LocalDateTime start, java.time.LocalDateTime end);
}
