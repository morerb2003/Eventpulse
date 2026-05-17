package com.event;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import org.springframework.retry.annotation.EnableRetry;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableJpaAuditing
@EnableScheduling
@EnableAsync
@EnableRetry
public class EventFeedbackApplication {

    public static void main(String[] args) {
        SpringApplication.run(EventFeedbackApplication.class, args);
        System.out.println("Event Feedback Management System Started Successfully");
    }

}



