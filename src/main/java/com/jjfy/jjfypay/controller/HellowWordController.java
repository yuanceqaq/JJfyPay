package com.jjfy.jjfypay.controller;

import com.jjfy.jjfypay.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
public class HellowWordController {

    @Autowired
    private UserService userService;

    @RequestMapping("/hello")
    public String  helloWord(){
        return "login";
    }
}
