package org.annp.checkorder.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.annp.checkorder.dto.Code2faResponseDto;
import org.annp.checkorder.dto.LoginRequestDto;
import org.annp.checkorder.dto.LoginResponseDto;
import org.annp.checkorder.dto.SecretKeyRequestDto;
import org.annp.checkorder.entity.Account;
import org.annp.checkorder.entity.Order;
import org.annp.checkorder.entity.User;
import org.annp.checkorder.security.JwtTokenProvider;
import org.annp.checkorder.service.AccountService;
import org.annp.checkorder.service.OrderService;
import org.annp.checkorder.service.TwoFaService;
import org.annp.checkorder.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/public")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserService userService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private AccountService accountService;

    @Autowired
    private TwoFaService twoFaService;

    @PostMapping("/check-secret-key")
    public ResponseEntity<?> checkSecretKey(@RequestBody SecretKeyRequestDto secretKey) {
        try {
            if (orderService.countBySecretKey(secretKey.getData().getSecretKey())) {
                Order order = this.orderService.findOrderBySecretKey(secretKey.getData().getSecretKey());
                if (order != null) {
                    ZoneId zoneId = ZoneId.of("Asia/Bangkok"); // GMT+7
                    ZonedDateTime currentDateTime = ZonedDateTime.now(zoneId);
                    LocalDate currentDate = currentDateTime.toLocalDate();
                    LocalDate orderDate = order.getUpdateDate() != null ?
                            order.getUpdateDate().atZone(zoneId).toLocalDate() : null;
                    LocalDate orderEnd = order.getEndDate() != null ?
                            order.getEndDate().atZone(zoneId).toLocalDate() : null;

                    if (orderEnd != null && currentDate.isAfter(orderEnd)) {
                        order.setStatus(3);
                        order.setSum2fa(2);
                        order.setAccountId(null);
                    } else {
                        if (orderDate == null || !currentDate.isEqual(orderDate)) {
                            order.setUpdateDate(currentDateTime.toInstant());
                            order.setStatus(1);
                            order.setSum2fa(0);
                        }
                        if (order.getPaidDate() == null) {
                            order.setPaidDate(currentDateTime.toInstant());
                            LocalDate endDate = currentDate.plusMonths(1);
                            if (endDate.getMonth() != currentDate.getMonth()) {
                                if (endDate.getDayOfMonth() > currentDate.lengthOfMonth()) {
                                    endDate = endDate.withDayOfMonth(endDate.lengthOfMonth());
                                }
                            }
                            ZonedDateTime endDateTime = endDate.atStartOfDay(zoneId)
                                    .withHour(currentDateTime.getHour())
                                    .withMinute(currentDateTime.getMinute())
                                    .withSecond(currentDateTime.getSecond())
                                    .withNano(currentDateTime.getNano());

                            order.setEndDate(endDateTime.toInstant());
                        }
                    }

                    Map<String, Object> response = new HashMap<>();
                    response.put("paidDate", order.getPaidDate());
                    response.put("endDate", order.getEndDate());
                    response.put("status", order.getStatus());
                    response.put("sum2fa", order.getSum2fa());
                    return orderService.saveOrder(order) ?
                            new ResponseEntity<>(response, HttpStatus.OK) :
                            new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
                } else {
                    return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
                }
            } else {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        } catch (Exception ex) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/secret-key/code-2fa")
    public ResponseEntity<?> call2faBySecretKey(@RequestBody SecretKeyRequestDto secretKey) {
        try {
            Order order = this.orderService.findOrderBySecretKey(secretKey.getData().getSecretKey());
            if (order != null) {
                ZoneId zoneId = ZoneId.of("Asia/Bangkok"); // GMT+7
                ZonedDateTime currentDateTime = ZonedDateTime.now(zoneId);
                LocalDate currentDate = currentDateTime.toLocalDate();

                LocalDate orderEnd = order.getEndDate() != null ?
                        order.getEndDate().atZone(zoneId).toLocalDate() : null;

                if (currentDate.isAfter(orderEnd)) {
                    return new ResponseEntity<>(HttpStatus.PAYMENT_REQUIRED);
                } else {
                    if (order.getStatus() == 1 && order.getSum2fa() < 2) {
                        Account account = this.accountService.findAccountById(order.getAccountId());
                        String code = twoFaService.get2faCode(account.getCode2fa());
                        order.setSum2fa(order.getSum2fa() + 1);
                        if (order.getSum2fa() == 1) {
                            order.setUpdateDate(currentDateTime.toInstant());
                        }
                        if (order.getSum2fa() == 2) {
                            order.setStatus(2);
                        }
                        Code2faResponseDto.Data data = new Code2faResponseDto.Data();
                        data.setCode2fa(code);
                        data.setSum2fa(order.getSum2fa());
                        data.setStatus(order.getStatus());

                        Code2faResponseDto code2fa = new Code2faResponseDto();
                        code2fa.setData(data);

                        return orderService.saveOrder(order) ?
                                new ResponseEntity<>(code2fa, HttpStatus.OK) :
                                new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
                    } else {
                        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
                    }
                }
            } else {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        } catch (Exception ex) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto loginRequestDto) {
        // Thực hiện authenticate với Spring Security
        try {
            // Quăng lỗi nếu username/password sai
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequestDto.getUsername(),
                            loginRequestDto.getPassword()
                    )
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            // Tìm user để lấy thêm thông tin, tuỳ bạn
            User user = userService.findByUsername(loginRequestDto.getUsername());

            // Tạo token
            String token = tokenProvider.generateToken(user);

            // Return cho client
            return ResponseEntity.ok(new LoginResponseDto(token, user.getId(), user.getFullname(), user.getRoleId(), 3600));

        } catch (BadCredentialsException e) {
            return ResponseEntity
                    .status(401)
                    .body(new LoginResponseDto(null, null, null, null, null));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        try {
            // Xóa session của người dùng
            SecurityContextHolder.clearContext();
            // Xóa cookie nếu có
            Cookie logoutCookie = new Cookie("jwt", "");
            logoutCookie.setPath("/");  // Đảm bảo path khớp với nơi lưu cookie
            logoutCookie.setMaxAge(0);  // Xóa cookie
            response.addCookie(logoutCookie);

            // Redirect về trang login hoặc trang khác sau khi logout
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
