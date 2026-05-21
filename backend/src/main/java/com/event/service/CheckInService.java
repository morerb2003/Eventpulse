package com.event.service;

import com.event.entity.Booking;

public interface CheckInService {
    Booking processCheckin(String token);
}
