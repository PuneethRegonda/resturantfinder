package com.opensource.resturantfinder.controller;


import com.opensource.resturantfinder.common.ApiResponse;
import com.opensource.resturantfinder.model.*;
import com.opensource.resturantfinder.entity.User;
import com.opensource.resturantfinder.service.GoogleAuthService;
import com.opensource.resturantfinder.service.UserService;
import com.opensource.resturantfinder.security.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Authentication API")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private GoogleAuthService googleAuthService;

    @Autowired
    private UserService userService;

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    @PostMapping("/signup")
    @Operation(summary = "User signup", description = "Register a new user")
    public ResponseEntity<ApiResponse<AuthenticationResponse>> signup(
            @RequestBody SignupRequest signupRequest,
            @RequestHeader("X-Request-ID") String requestId) {

        log.info("Signup request received: " + signupRequest);
        // Create the user
        userService.createUser(signupRequest.getUsername(), signupRequest.getEmail(), signupRequest.getPassword());

        // Authenticate the user
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(signupRequest.getEmail(), signupRequest.getPassword())
        );

        // Generate JWT token
        final UserDetails userDetails = userDetailsService.loadUserByUsername(signupRequest.getEmail());
        final String jwt = jwtUtil.generateToken(userDetails.getUsername());

        AuthenticationResponse authResponse = new AuthenticationResponse(jwt);
        return ResponseEntity.ok(ApiResponse.success(authResponse, requestId));
    }


    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticate a user and return a JWT token")
    public ResponseEntity<ApiResponse<AuthenticationResponse>> createAuthenticationToken(
            @RequestBody AuthenticationRequest authenticationRequest,
            @RequestHeader("X-Request-ID") String requestId) {

        log.info("login request received: {}" , authenticationRequest);

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authenticationRequest.getEmail(), authenticationRequest.getPassword())
        );

        final UserDetails userDetails = userDetailsService.loadUserByUsername(authenticationRequest.getEmail());
        final String jwt = jwtUtil.generateToken(userDetails);

        AuthenticationResponse authResponse = new AuthenticationResponse(jwt);
        return ResponseEntity.ok(ApiResponse.success(authResponse, requestId));
    }


    // New Google OAuth login method
    @PostMapping("/google")
    @Operation(summary = "Google OAuth login", description = "Authenticate a user with Google OAuth")
    public ResponseEntity<ApiResponse<AuthenticationResponse>> googleLogin(
            @RequestBody GoogleAuthRequest googleAuthRequest,
            @RequestHeader("X-Request-ID") String requestId) {

        // Exchange the authorization code for Google user info
        GoogleUserInfo googleUserInfo = googleAuthService.getGoogleUserInfo(googleAuthRequest.getCode());

        // Create or update user in our database
        User user = userService.createOrUpdateGoogleUser(googleUserInfo);

        // Generate JWT token
        final String jwt = jwtUtil.generateToken(user.getUsername());

        AuthenticationResponse authResponse = new AuthenticationResponse(jwt);
        return ResponseEntity.ok(ApiResponse.success(authResponse, requestId));
    }
}