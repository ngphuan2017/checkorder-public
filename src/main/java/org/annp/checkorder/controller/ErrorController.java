package org.annp.checkorder.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class ErrorController implements org.springframework.boot.web.servlet.error.ErrorController{

    @RequestMapping("/error")
    public String handleError(HttpServletRequest request, Model model, @RequestParam(value = "error", required = false) Integer statusParam) {
        // Kiểm tra loại lỗi để hiển thị thông báo phù hợp
        int statusCode = statusParam != null ? statusParam : HttpStatus.NOT_FOUND.value();

        // Mặc định
        model.addAttribute("title", "Không tìm thấy trang");
        model.addAttribute("message", "TRANG BẠN YÊU CẦU KHÔNG TỒN TẠI");

        // Có thể thêm các loại lỗi khác nếu cần
        if (statusCode == HttpStatus.FORBIDDEN.value()) {
            model.addAttribute("title", "Truy cập bị từ chối");
            model.addAttribute("message", "TÀI KHOẢN CỦA BẠN KHÔNG ĐƯỢC CẤP QUYỀN TRUY CẬP");
        } else if (statusCode == HttpStatus.UNAUTHORIZED.value()) {
            model.addAttribute("title", "Lỗi xác thực");
            model.addAttribute("message", "LỖI XÁC THỰC (CHƯA ĐĂNG NHẬP HOẶC TOKEN KHÔNG HỢP LỆ)");
        }

        return "error";
    }
}
