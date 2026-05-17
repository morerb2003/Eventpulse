package com.event.serviceImpl;

import com.event.service.EmailService;
import org.springframework.mail.javamail.JavaMailSender;

import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;

@Service
@Async
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender emailSender;

    public EmailServiceImpl(JavaMailSender emailSender) {
        this.emailSender = emailSender;
    }

    @Override
    public void sendFeedbackConfirmation(String to, String userName, String eventTitle) {
        String subject = "Thank you for your feedback!";
        String content = String.format("<p>Dear <strong>%s</strong>,</p><p>Thank you for providing your feedback for the event: <strong>%s</strong>. " +
                "Your insights help us improve our future events.</p>", userName, eventTitle);
        sendHtmlMessage(to, subject, content, null);
    }

    @Override
    public void sendRegistrationEmail(String to, String userName) {
        String subject = "Welcome to EventPulse!";
        String content = String.format("<p>Dear <strong>%s</strong>,</p><p>Welcome to EventPulse! We are thrilled to have you join our community.</p>" +
                "<p>You can now explore, book, and provide feedback on premium events.</p>", userName);
        sendHtmlMessage(to, subject, content, null);
    }

    @Override
    public void sendEventNotification(String to, String userName, String eventTitle, String eventDate, byte[] ticketPdf) {
        String subject = "Booking Confirmation: " + eventTitle;
        String content = String.format("<p>Dear <strong>%s</strong>,</p><p>Your booking for '<strong>%s</strong>' is confirmed.</p>" +
                "<p><strong>Event Date:</strong> %s</p><p>Please find your digital ticket attached below.</p><p>We look forward to seeing you there!</p>", 
                userName, eventTitle, eventDate);
        sendHtmlMessage(to, subject, content, ticketPdf);
    }

    @Override
    public void sendFeedbackReminder(String to, String userName, String eventTitle, String feedbackLink) {
        String subject = "How was " + eventTitle + "? Share your thoughts!";
        String content = String.format("<p>Dear <strong>%s</strong>,</p><p>We hope you enjoyed '<strong>%s</strong>'.</p>" +
                "<p>Your feedback is incredibly valuable to us and helps organizers improve future events. " +
                "Please take a moment to share your experience here:</p>" +
                "<p><a href=\"%s\" style=\"display: inline-block; padding: 10px 20px; background-color: #0ea5e9; color: white; text-decoration: none; border-radius: 5px;\">Submit Feedback</a></p>", 
                userName, eventTitle, feedbackLink);
        sendHtmlMessage(to, subject, content, null);
    }

    @Override
    public void sendVerificationEmail(String to, String userName, String verificationLink) {
        String subject = "Verify Your EventPulse Account";
        String content = String.format("<p>Dear <strong>%s</strong>,</p>" +
                "<p>Welcome to EventPulse! To complete your registration, please verify your email address.</p>" +
                "<p><a href=\"%s\" style=\"display: inline-block; padding: 10px 20px; background-color: #0ea5e9; color: white; text-decoration: none; border-radius: 5px;\">Verify Email</a></p>" +
                "<p style=\"color: #eab308; font-size: 0.9em;\">This link will expire in 15 minutes.</p>", 
                userName, verificationLink);
        sendHtmlMessage(to, subject, content, null);
    }

    @Override
    public void sendSimpleMessage(String to, String subject, String text) {
        sendHtmlMessage(to, subject, "<p>" + text.replace("\n", "<br>") + "</p>", null);
    }

    @Retryable(value = Exception.class, maxAttempts = 3, backoff = @Backoff(delay = 2000))
    public void sendHtmlMessage(String to, String subject, String content, byte[] attachment) {
        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            String htmlTemplate = "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;\">" +
                                  "<div style=\"text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eee;\">" +
                                  "<h1 style=\"color: #0ea5e9; margin: 0;\">EventPulse</h1>" +
                                  "</div>" +
                                  "<div style=\"padding: 20px 0; color: #333; line-height: 1.6;\">" +
                                  content +
                                  "</div>" +
                                  "<div style=\"text-align: center; padding-top: 20px; border-top: 1px solid #eee; color: #888; font-size: 12px;\">" +
                                  "<p>Best Regards,<br>The EventPulse Team</p>" +
                                  "</div>" +
                                  "</div>";

            helper.setFrom("no-reply@eventpulse.com");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlTemplate, true);
            
            if (attachment != null) {
                helper.addAttachment("Event_Ticket.pdf", new org.springframework.core.io.ByteArrayResource(attachment));
            }
            
            emailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }
}
