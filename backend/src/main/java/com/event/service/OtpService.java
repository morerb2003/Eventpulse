package com.event.service;

public interface OtpService {
    String generateOtp(String key);
    boolean validateOtp(String key, String otp);
}
