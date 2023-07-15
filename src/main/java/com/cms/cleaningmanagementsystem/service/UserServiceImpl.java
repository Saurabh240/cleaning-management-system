package com.cms.cleaningmanagementsystem.service;

import com.cms.cleaningmanagementsystem.model.User;
import com.cms.cleaningmanagementsystem.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
    public User getUserByLastName(String lastName) {
        return userRepository.findByLastName(lastName)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User createUser(User user) {
        Optional<User> byUsername = userRepository.findByUsername(user.getUsername());
        if (byUsername.isPresent()) {
            throw new RuntimeException("User Already Exist");
        }
         return userRepository.save(user);
    }

    public User updateUser(String username, User user) {
        User existingUser = getUserByUsername(username);
        existingUser.setPassword(user.getPassword());
        existingUser.setRole(user.getRole());
        existingUser.setCity(user.getCity());
        existingUser.setAddress(user.getAddress());
        existingUser.setPhone(user.getPhone());
        return userRepository.save(existingUser);
    }

    public void deleteUser(String username) {
        userRepository.deleteByUsername(username);
    }
}
