package com.event.dto;

import com.event.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.Email;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthRequestDto {
    @Email(message = "Please provide a valid email address")
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private Role role;
}
