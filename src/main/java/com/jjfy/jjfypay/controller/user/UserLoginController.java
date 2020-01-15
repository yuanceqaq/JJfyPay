package com.jjfy.jjfypay.controller.user;

import com.jjfy.jjfypay.domain.User;
import com.jjfy.jjfypay.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;


@Controller
@RequestMapping("/user")
public class UserLoginController {

    @Autowired
    UserService userService;

    @RequestMapping("/index")
    public String  index(){
        return "index";
    }
    @RequestMapping("/login")
    public String  login(@RequestParam User user){
        userService.login(user);
        return "index";
    }
}
