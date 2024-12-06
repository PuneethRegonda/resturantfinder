package com.opensource.resturantfinder.service;

import com.opensource.resturantfinder.entity.User;
import com.opensource.resturantfinder.model.GoogleUserInfo;
import com.opensource.resturantfinder.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashSet;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;


    @Autowired
    private PasswordEncoder passwordEncoder;

    public User createOrUpdateGoogleUser(GoogleUserInfo googleUserInfo) {
        User user = userRepository.findByEmail(googleUserInfo.getEmail())
                .orElse(new User());

        user.setEmail(googleUserInfo.getEmail());
        user.setName(googleUserInfo.getName());
        user.setGoogleId(googleUserInfo.getId());
        user.setRoles(new HashSet<>(Collections.singletonList("USER")));
        return userRepository.save(user);
    }

    public User createUser(String username, String email, String password) {
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRoles(new HashSet<>(Collections.singletonList("USER")));
        return userRepository.save(user);
    }


}