package org.annp.checkorder.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.annp.checkorder.entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long expirationInMs;

    public String generateToken(User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationInMs);
        SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes()); // chuyển đổi chuỗi thành key

        return Jwts.builder()
                .setSubject(user.getUsername())         // Đưa username làm subject
                .claim("id", user.getId())                 // Thêm custom claim id
                .claim("roleId", user.getRoleId())         // Thêm custom claim roleId
                .claim("fullname", user.getFullname())     // Thêm custom claim fullname
                .setIssuedAt(now)            // Thời gian tạo token
                .setExpiration(expiryDate)   // Thời gian hết hạn
                .signWith(key, SignatureAlgorithm.HS512) // sử dụng key đã chuyển đổi
                .compact();
    }
}
