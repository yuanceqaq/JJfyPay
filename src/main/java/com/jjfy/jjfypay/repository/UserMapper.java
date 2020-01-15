package com.jjfy.jjfypay.repository;

import com.jjfy.jjfypay.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserMapper extends JpaRepository<User,Integer> {
}
