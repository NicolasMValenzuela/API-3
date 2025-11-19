package com.uade.tpo.demo.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserDTO {
    private Long idCliente;
    private String username;
    private String firstName;
    private String lastName;
}