package com.event.serviceImpl;

import com.event.service.OtpService;
import org.springframework.stereotype.Service;

import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Service
public class OtpServiceImpl implements OtpService {

    private final ConcurrentHashMap<String, OtpData> otpStorage = new ConcurrentHashMap<>();
    private final long OTP_VALID_DURATION = TimeUnit.MINUTES.toMillis(5);

    @Override
    public String generateOtp(String key) {
        String otp = String.format("%06d", new Random().nextInt(1000000));
        otpStorage.put(key, new OtpData(otp, System.currentTimeMillis() + OTP_VALID_DURATION));
        return otp;
    }

    @Override
    public boolean validateOtp(String key, String otp) {
        OtpData data = otpStorage.get(key);
        if (data == null || data.expiryTime < System.currentTimeMillis()) {
            otpStorage.remove(key);
            return false;
        }
        boolean isValid = data.otp.equals(otp);
        if (isValid) {
            otpStorage.remove(key);
        }
        return isValid;
    }

    private static class OtpData {
        String otp;
        long expiryTime;

        OtpData(String otp, long expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }
    }
}
