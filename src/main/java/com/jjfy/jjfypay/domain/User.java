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

    @Column(name = "username")
    private String username;

    @Column(name = "password")
    private String password;
}
