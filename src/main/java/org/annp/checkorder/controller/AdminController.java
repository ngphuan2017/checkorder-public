package org.annp.checkorder.controller;

import org.annp.checkorder.service.OrderService;
import org.annp.checkorder.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private OrderService orderService;

    @GetMapping("/admin")
    public String index(Authentication authentication) {
        if (authentication != null && !(authentication instanceof AnonymousAuthenticationToken)) {
            return "admin/admin";
        }
        return "login";
    }

    @GetMapping("/admin/order-management")
    public String orderManagement() {
        return "admin/order/order";
    }
}
