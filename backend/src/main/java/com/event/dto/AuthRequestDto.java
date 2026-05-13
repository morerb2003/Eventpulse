package com.event.dto;

import com.event.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthRequestDto {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private Role role;
}
