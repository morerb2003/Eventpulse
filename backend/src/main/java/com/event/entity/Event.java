package com.event.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event extends AuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    private String location;

    @Column(nullable = false)
    private LocalDateTime date;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id")
    private User creator;

    @Column(nullable = false)
    private String category;

    private String posterUrl;

    private Integer capacity;

    private LocalDateTime startTime;

    /** Unique token embedded in the check-in QR code URL */
    @Column(unique = true)
    private String qrToken;

    /** Pre-generated QR image stored as Base64 data-URI */
    @Column(columnDefinition = "TEXT")
    private String qrCodeBase64;

    private Double price;

    private Integer availableSeats;
}
