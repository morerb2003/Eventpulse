package com.event.service;

public interface EmailService {
    void sendFeedbackConfirmation(String to, String userName, String eventTitle);
    void sendRegistrationEmail(String to, String userName);
    void sendEventNotification(String to, String userName, String eventTitle, String eventDate, byte[] ticketPdf, String qrCodeBase64);
    void sendFeedbackReminder(String to, String userName, String eventTitle, String feedbackLink);
    void sendSimpleMessage(String to, String subject, String text);
    void sendCertificateEmail(String to, String userName, String eventTitle, byte[] certificatePdf);
}
