package com.event.service;

import com.event.dto.AuthRequestDto;
import com.event.dto.AuthResponseDto;

public interface AuthService {
    AuthResponseDto register(AuthRequestDto request);
    AuthResponseDto authenticate(AuthRequestDto request);
    void forgotPassword(String email);
    void resetPassword(String email, String otp, String newPassword);
}
