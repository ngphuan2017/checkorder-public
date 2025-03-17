package org.annp.checkorder.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@ControllerAdvice
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "home";
    }
}
