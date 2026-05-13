package com.event.serviceImpl;

import com.event.service.EmailService;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender emailSender;

    public EmailServiceImpl(JavaMailSender emailSender) {
        this.emailSender = emailSender;
    }

    @Override
    public void sendFeedbackConfirmation(String to, String userName, String eventTitle) {
        String subject = "Thank you for your feedback!";
        String text = String.format("Dear %s,\n\nThank you for providing your feedback for the event: %s. " +
                "Your insights help us improve our future events.\n\nBest Regards,\nEventPulse Team", 
                userName, eventTitle);
        sendSimpleMessage(to, subject, text);
    }

    @Override
    public void sendSimpleMessage(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("no-reply@eventpulse.com");
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            emailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }
}
