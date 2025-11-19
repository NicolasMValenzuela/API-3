package com.uade.tpo.demo.service;

import com.uade.tpo.demo.entity.User;

public interface UserService {
    public User createUser(User user) ;
    public java.util.List<User> getAllUsers() ;
    public java.util.Optional<User> getUserById(Long id) ;
    public User updateUser(Long id, User userDetails) ;
    public void deleteUser(Long id);
}
