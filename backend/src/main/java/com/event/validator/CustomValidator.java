package com.event.validator;

import org.springframework.stereotype.Component;

@Component
public class CustomValidator {
    public boolean isValidEmail(String email) {
        return email != null && email.contains("@");
    }
}
