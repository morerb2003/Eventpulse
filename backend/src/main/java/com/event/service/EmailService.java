package com.event.service;

public interface EmailService {
    void sendFeedbackConfirmation(String to, String userName, String eventTitle);
    void sendSimpleMessage(String to, String subject, String text);
}
