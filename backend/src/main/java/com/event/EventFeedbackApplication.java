package com.event;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class EventFeedbackApplication {

    public static void main(String[] args) {
        SpringApplication.run(EventFeedbackApplication.class, args);
        System.out.println("Event Feedback Management System Started Successfully");
    }

}



