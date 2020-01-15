package com.jjfy.jjfypay.service.impl;

import com.jjfy.jjfypay.domain.User;
import com.jjfy.jjfypay.repository.UserMapper;
import com.jjfy.jjfypay.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserMapper userMapper;

    @Override
    public void login(User user) {
        String password = user.getPassword();
        String username = user.getUsername();
        System.out.println(password);
        System.out.println(username);
    }
}
