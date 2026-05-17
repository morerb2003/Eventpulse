package com.event.service;

public interface EmailService {
    void sendFeedbackConfirmation(String to, String userName, String eventTitle);
    void sendRegistrationEmail(String to, String userName);
    void sendEventNotification(String to, String userName, String eventTitle, String eventDate, byte[] ticketPdf);
    void sendFeedbackReminder(String to, String userName, String eventTitle, String feedbackLink);
    void sendVerificationEmail(String to, String userName, String verificationLink);
    void sendSimpleMessage(String to, String subject, String text);
}
