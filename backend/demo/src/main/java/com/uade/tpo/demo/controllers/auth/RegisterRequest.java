package com.uade.tpo.demo.controllers.auth;

import com.uade.tpo.demo.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor 
public class RegisterRequest {
    private String username;
    private String password;
    private String firstName;
    private String lastName;
    private Integer documento;
    private Integer telefono;
    private String email;
    private Role role;
}