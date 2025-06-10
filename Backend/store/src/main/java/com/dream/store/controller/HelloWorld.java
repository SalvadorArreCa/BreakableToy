package com.dream.store.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloWorld {
    @GetMapping(path = "/hello-world")
    public String holaMundo(){
        return "Muy Buenas Gente, jueguen Shin Megami Tensei Nocturne";
    }
}
