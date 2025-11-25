package com.uade.tpo.demo.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.uade.tpo.demo.controllers.auth.AuthenticationRequest;
import com.uade.tpo.demo.controllers.auth.AuthenticationResponse;
import com.uade.tpo.demo.controllers.auth.RegisterRequest;
import com.uade.tpo.demo.controllers.config.JwtService;
import com.uade.tpo.demo.dto.UserDTO;
import com.uade.tpo.demo.entity.User;
import com.uade.tpo.demo.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
        private final UserRepository repository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;

        public AuthenticationResponse register(RegisterRequest request) {
                // Verificar si el usuario ya existe
                if (repository.findByUsername(request.getUsername()).isPresent()) {
                        throw new RuntimeException("El usuario ya está registrado");
                }
                
                var user = User.builder()
                                .username(request.getUsername())
                                .firstName(request.getFirstName())
                                .lastName(request.getLastName())
                                .documento(request.getDocumento())
                                .telefono(request.getTelefono())
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .role(request.getRole())
                                .build();

                repository.save(user);
                var jwtToken = jwtService.generateToken(user);
                UserDTO userDTO = new UserDTO();
                userDTO.setIdCliente(user.getIdCliente());
                userDTO.setUsername(user.getUsername());
                userDTO.setFirstName(user.getFirstName());
                userDTO.setLastName(user.getLastName());
                userDTO.setRole(user.getRole().name());
                return AuthenticationResponse.builder()
                                .accessToken(jwtToken)
                                .user(userDTO)
                                .build();
        }

        public AuthenticationResponse authenticate(AuthenticationRequest request) {
                try {
                        authenticationManager.authenticate(
                                        new UsernamePasswordAuthenticationToken(
                                                        request.getUsername(),
                                                        request.getPassword()));
                } catch (Exception e) {
                        throw new RuntimeException("Credenciales inválidas. Verifica tu usuario y contraseña.");
                }

                var user = repository.findByUsername(request.getUsername())
                                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
                var jwtToken = jwtService.generateToken(user);
                UserDTO userDTO = new UserDTO();
                userDTO.setIdCliente(user.getIdCliente());
                userDTO.setUsername(user.getUsername());
                userDTO.setFirstName(user.getFirstName());
                userDTO.setLastName(user.getLastName());
                userDTO.setRole(user.getRole().name());
                return AuthenticationResponse.builder()
                                .accessToken(jwtToken)
                                .user(userDTO)
                                .build();
        }
}
