package com.uade.tpo.demo.service;

import com.uade.tpo.demo.entity.User;
import com.uade.tpo.demo.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private  UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no disponible"));
        user.setUsername(userDetails.getUsername());
        user.setLastName(userDetails.getLastName());
        user.setDocumento(userDetails.getDocumento());
        user.setEmail(userDetails.getEmail());
        user.setTelefono(userDetails.getTelefono());
        user.setPassword(userDetails.getPassword());
        user.setRole(userDetails.getRole());
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}