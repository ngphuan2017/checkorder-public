package org.annp.checkorder.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.annp.checkorder.dto.ClientRequestDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ApiUserController {

    @PostMapping("/public/set-cookie")
    public ResponseEntity<?> setCookie(@RequestBody ClientRequestDto request, HttpServletResponse response) {
        try {
            // Tùy chọn: xác thực token trước khi thiết lập cookie
            String token = request.getToken();

            // Thiết lập cookie bảo mật
            Cookie cookie = new Cookie("jwt", token);
            cookie.setPath("/");
            cookie.setHttpOnly(true); // Không thể truy cập bằng JavaScript
            cookie.setMaxAge(3600); // Thời gian sống 1 giờ
            cookie.setSecure(true); // Chỉ gửi qua HTTPS (trong môi trường production)

            response.addCookie(cookie);
            response.addHeader("Set-Cookie", "jwt=" + token + "; Path=/; HttpOnly; Max-Age=3600; Secure; SameSite=Strict");

            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
