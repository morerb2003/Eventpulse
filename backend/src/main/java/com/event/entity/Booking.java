package com.event.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking extends AuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seat_id")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Seat seat;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private String paymentStatus; // PENDING, COMPLETED, FAILED

    private String paymentId;

    private String razorpayOrderId;

    private String stripeSessionId;

    private LocalDateTime bookingDate;

    @Column(columnDefinition = "TEXT")
    private String qrCode;

    @Column(unique = true)
    private String checkInToken;

    @Column(columnDefinition = "TEXT")
    private String qrCodeImage;

    @Column(nullable = false, columnDefinition = "boolean default false")
    @Builder.Default
    private boolean checkedIn = false;

    private LocalDateTime checkedInAt;
}
