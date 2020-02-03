package com.jjfy.jjfypay.domain;

import lombok.Data;

import javax.persistence.*;

@Entity
@Table(name = "login")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "logName")
    private String username;

    @Column(name = "logPass")
    private String password;
}
