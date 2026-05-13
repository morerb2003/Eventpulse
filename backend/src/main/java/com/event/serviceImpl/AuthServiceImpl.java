package com.event.serviceImpl;

import com.event.dto.AuthRequestDto;
import com.event.dto.AuthResponseDto;
import com.event.entity.Role;
import com.event.entity.User;
import com.event.repository.UserRepository;
import com.event.security.JwtUtil;
import com.event.service.AuthService;
import com.event.service.EmailService;
import com.event.service.OtpService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;
    private final OtpService otpService;

    public AuthServiceImpl(UserRepository repository, 
                           PasswordEncoder passwordEncoder, 
                           JwtUtil jwtUtil, 
                           AuthenticationManager authenticationManager,
                           EmailService emailService,
                           OtpService otpService) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.emailService = emailService;
        this.otpService = otpService;
    }

    @Override
    public AuthResponseDto register(AuthRequestDto request) {
        if (repository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists: " + request.getEmail());
        }
        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() != null ? request.getRole() : Role.USER)
                .build();
        repository.save(user);
        String jwtToken = jwtUtil.generateToken(user);
        return AuthResponseDto.builder()
                .token(jwtToken)
                .user(user)
                .build();
    }

    @Override
    public AuthResponseDto authenticate(AuthRequestDto request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        User user = repository.findByEmail(request.getEmail())
                .orElseThrow();
        String jwtToken = jwtUtil.generateToken(user);
        return AuthResponseDto.builder()
                .token(jwtToken)
                .user(user)
                .build();
    }

    @Override
    public void forgotPassword(String email) {
        User user = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        
        String otp = otpService.generateOtp(email);
        emailService.sendSimpleMessage(email, "Password Reset OTP", 
                "Your OTP for password reset is: " + otp + ". Valid for 5 minutes.");
    }

    @Override
    public void resetPassword(String email, String otp, String newPassword) {
        if (!otpService.validateOtp(email, otp)) {
            throw new RuntimeException("Invalid or expired OTP");
        }
        
        User user = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        
        user.setPassword(passwordEncoder.encode(newPassword));
        repository.save(user);
    }
}
