package org.annp.checkorder.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.annp.checkorder.service.impl.CustomUserDetailsServiceImpl;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Value("${jwt.secret}")
    private String secret;

    private final CustomUserDetailsServiceImpl customUserDetailsService;

    public JwtAuthenticationFilter(CustomUserDetailsServiceImpl customUserDetailsService) {
        this.customUserDetailsService = customUserDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            // Lấy token từ header
            String jwt = getJwtFromRequest(request);
            SecretKey secretKey = Keys.hmacShaKeyFor(secret.getBytes());
            if (StringUtils.hasText(jwt)) {
                // Giải mã token
                Jws<Claims> parsedToken = Jwts.parser()
                        .setSigningKey(secretKey) // Sử dụng SecretKey
                        .build()
                        .parseSignedClaims(jwt);  // Phương thức mới

                // Lấy payload
                Claims claims = parsedToken.getPayload();

                // Truy cập dữ liệu
                String username = claims.getSubject();
                Integer id = claims.get("id", Integer.class);
                Integer roleId = claims.get("roleId", Integer.class);
                String fullname = claims.get("fullname", String.class);

                // Nếu token OK, load user từ DB
                if (username != null) {
                    var userDetails = customUserDetailsService.loadUserByUsername(username);
                    var auth = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities()
                    );
                    auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    // Đặt thông tin vào SecurityContext
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            }
        } catch (ExpiredJwtException ex) {
            System.out.println("Token đã hết hạn: " + ex.getMessage());
        } catch (Exception ex) {
            System.out.println("Lỗi xác thực token: " + ex.getMessage());
        }

        // Tiếp tục chain
        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        // Thông thường token có dạng: "Bearer <token>"
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        // Kiểm tra cookie
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("jwt".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}
