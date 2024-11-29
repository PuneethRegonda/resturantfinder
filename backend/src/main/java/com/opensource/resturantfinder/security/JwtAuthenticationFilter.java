package com.opensource.resturantfinder.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.opensource.resturantfinder.common.ApiResponse;
import com.opensource.resturantfinder.common.ErrorDetails;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");

        String username = null;
        String jwt = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            try {
                if (jwtUtil.isTokenExpired(jwt)) {
                    handleJwtTokenExpiredException(request, response);
                    return;
                }
                username = jwtUtil.extractUsername(jwt);
            } catch (JwtException e) {
                handleJwtException(request, response, e);
                return;
            }
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
            if (jwtUtil.validateToken(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
            }
        }
        chain.doFilter(request, response);
    }

    private void handleJwtTokenExpiredException(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String requestId = request.getHeader("X-Request-ID");
        ErrorDetails errorDetails = new ErrorDetails("TOKEN_EXPIRED", "JWT token has expired", null);
        ApiResponse<Void> apiResponse = ApiResponse.error(errorDetails, requestId);
        sendErrorResponse(response, HttpStatus.FORBIDDEN, apiResponse);
    }

    private void handleJwtException(HttpServletRequest request, HttpServletResponse response, JwtException e) throws IOException {
        String requestId = request.getHeader("X-Request-ID");
        ErrorDetails errorDetails = new ErrorDetails("JWT_ERROR", e.getMessage(), null);
        ApiResponse<Void> apiResponse = ApiResponse.error(errorDetails, requestId);
        sendErrorResponse(response, HttpStatus.UNAUTHORIZED, apiResponse);
    }

    private void sendErrorResponse(HttpServletResponse response, HttpStatus status, ApiResponse<Void> apiResponse) throws IOException {
        response.setStatus(status.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        objectMapper.writeValue(response.getWriter(), apiResponse);
    }
}