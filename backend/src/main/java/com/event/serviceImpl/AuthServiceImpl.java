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
        String token = java.util.UUID.randomUUID().toString();
        
        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() != null ? request.getRole() : Role.USER)
                .emailVerified(false)
                .verificationToken(token)
                .tokenExpiry(java.time.LocalDateTime.now().plusMinutes(15))
                .build();
        repository.save(user);
        
        try {
            String verificationLink = "http://localhost:5173/verify?token=" + token; // Or better, fetch frontendUrl from props
            emailService.sendVerificationEmail(user.getEmail(), user.getFirstName(), verificationLink);
        } catch (Exception e) {
            System.err.println("Failed to send verification email: " + e.getMessage());
        }
        
        // Don't generate JWT token and login right away, require verification
        return AuthResponseDto.builder()
                .message("Verification email sent")
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
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!user.isEmailVerified()) {
            throw new RuntimeException("Please verify your email first");
        }

        String jwtToken = jwtUtil.generateToken(user);
        return AuthResponseDto.builder()
                .message("Login successful")
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

    public void verifyEmail(String token) {
        User user = repository.findByVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid verification token"));

        if (user.isEmailVerified()) {
            throw new RuntimeException("Email is already verified");
        }

        if (user.getTokenExpiry().isBefore(java.time.LocalDateTime.now())) {
            throw new RuntimeException("Verification token has expired");
        }

        user.setEmailVerified(true);
        user.setVerificationToken(null);
        user.setTokenExpiry(null);
        repository.save(user);
        
        // Optional: send welcome/registration email after successful verification
        try {
            emailService.sendRegistrationEmail(user.getEmail(), user.getFirstName());
        } catch (Exception e) {
            System.err.println("Failed to send registration email: " + e.getMessage());
        }
    }

    public void resendVerification(String email) {
        User user = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.isEmailVerified()) {
            throw new RuntimeException("Email is already verified");
        }

        String token = java.util.UUID.randomUUID().toString();
        user.setVerificationToken(token);
        user.setTokenExpiry(java.time.LocalDateTime.now().plusMinutes(15));
        repository.save(user);

        try {
            String verificationLink = "http://localhost:5173/verify?token=" + token;
            emailService.sendVerificationEmail(user.getEmail(), user.getFirstName(), verificationLink);
        } catch (Exception e) {
            System.err.println("Failed to resend verification email: " + e.getMessage());
        }
    }
}
