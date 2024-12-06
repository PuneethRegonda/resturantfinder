package com.opensource.resturantfinder.config.exception;

import com.opensource.resturantfinder.common.ApiResponse;
import com.opensource.resturantfinder.common.ErrorDetails;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.client.HttpClientErrorException;

import java.util.Collections;

@ControllerAdvice
public class AuthenticationExceptionHandler {

    // Handle Bad Credentials (wrong email or password)
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<Void>> handleBadCredentialsException(BadCredentialsException ex, WebRequest request) {
        String requestId = request.getHeader("X-Request-ID");
        ErrorDetails errorDetails = new ErrorDetails(
                "INVALID_CREDENTIALS",
                "Invalid email or password",
                null
        );
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error(errorDetails, requestId));
    }

    // Handle Internal Authentication Service Exception
    @ExceptionHandler(InternalAuthenticationServiceException.class)
    public ResponseEntity<ApiResponse<Void>> handleInternalAuthenticationServiceException(InternalAuthenticationServiceException ex, WebRequest request) {
        String requestId = request.getHeader("X-Request-ID");
        ErrorDetails errorDetails = new ErrorDetails(
                "AUTHENTICATION_FAILED",
                "Authentication failed due to internal error",
                Collections.singletonList(ex.getMessage())
        );
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error(errorDetails, requestId));
    }

    // Handle Generic Authentication Exceptions
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiResponse<Void>> handleAuthenticationException(AuthenticationException ex, WebRequest request) {
        String requestId = request.getHeader("X-Request-ID");
        ErrorDetails errorDetails = new ErrorDetails(
                "AUTHENTICATION_ERROR",
                "Authentication error occurred",
                Collections.singletonList(ex.getMessage())
        );
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error(errorDetails, requestId));
    }

    // Existing Handlers
    @ExceptionHandler(HttpClientErrorException.BadRequest.class)
    public ResponseEntity<ApiResponse<Void>> handleBadRequestException(HttpClientErrorException.BadRequest ex, WebRequest request) {
        String requestId = request.getHeader("X-Request-ID");
        ErrorDetails errorDetails = new ErrorDetails(
                "INVALID_GRANT",
                "Bad Request",
                Collections.singletonList(ex.getResponseBodyAsString())
        );
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(errorDetails, requestId));
    }

    @ExceptionHandler(NoSuchMethodError.class)
    public ResponseEntity<ApiResponse<Void>> handleNoSuchMethodError(NoSuchMethodError ex, WebRequest request) {
        String requestId = request.getHeader("X-Request-ID");
        ErrorDetails errorDetails = new ErrorDetails(
                "JWT_LIBRARY_ERROR",
                "JWT library configuration error",
                Collections.singletonList("There's a version mismatch in the JWT library. Please check your dependencies.")
        );
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(errorDetails, requestId));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGenericException(Exception ex, WebRequest request) {
        String requestId = request.getHeader("X-Request-ID");
        ErrorDetails errorDetails = new ErrorDetails(
                "INTERNAL_SERVER_ERROR",
                "An unexpected error occurred",
                Collections.singletonList(ex.getMessage())
        );
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(errorDetails, requestId));
    }
}
