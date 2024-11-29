package com.opensource.resturantfinder.config.exception;

import com.opensource.resturantfinder.common.ApiResponse;
import com.opensource.resturantfinder.common.ErrorDetails;
import com.opensource.resturantfinder.exception.JwtTokenExpiredException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.context.request.WebRequest;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalExceptionHandler {

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

    @ExceptionHandler(MethodArgumentNotValidException.class)
    protected ResponseEntity<ApiResponse<Void>> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex, WebRequest request) {
        String requestId = request.getHeader("X-Request-ID");
        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.toList());
        ErrorDetails errorDetails = new ErrorDetails("VALIDATION_ERROR", "Validation failed", errors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(errorDetails, requestId));
    }

    @ExceptionHandler(JwtTokenExpiredException.class)
    public ResponseEntity<ApiResponse<Void>> handleJwtTokenExpiredException(JwtTokenExpiredException ex, WebRequest request) {
        String requestId = request.getHeader("X-Request-ID");
        ErrorDetails errorDetails = new ErrorDetails("TOKEN_EXPIRED", ex.getMessage(), null);
        ApiResponse<Void> apiResponse = ApiResponse.error(errorDetails, requestId);
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(apiResponse);
    }

}