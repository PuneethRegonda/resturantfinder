package com.opensource.resturantfinder.config.exception;

import com.opensource.resturantfinder.common.ApiResponse;
import com.opensource.resturantfinder.common.ErrorDetails;
import com.opensource.resturantfinder.exception.DuplicateReviewException;
import com.opensource.resturantfinder.exception.ResourceNotFoundException;
import com.opensource.resturantfinder.exception.ValidationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

@ControllerAdvice
public class ReviewExceptionAdvisor {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleResourceNotFoundException(ResourceNotFoundException ex, WebRequest request) {
        String requestId = request.getHeader("X-Request-ID");
        ErrorDetails errorDetails = new ErrorDetails("RESOURCE_NOT_FOUND", ex.getMessage(), null);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(errorDetails, requestId));
    }

    @ExceptionHandler(DuplicateReviewException.class)
    public ResponseEntity<ApiResponse<Void>> handleDuplicateReviewException(DuplicateReviewException ex, WebRequest request) {
        String requestId = request.getHeader("X-Request-ID");
        ErrorDetails errorDetails = new ErrorDetails("DUPLICATE_REVIEW", ex.getMessage(), null);
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ApiResponse.error(errorDetails, requestId));
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationException(ValidationException ex, WebRequest request) {
        String requestId = request.getHeader("X-Request-ID");
        ErrorDetails errorDetails = new ErrorDetails("VALIDATION_ERROR", ex.getMessage(), null);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error(errorDetails, requestId));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGenericException(Exception ex, WebRequest request) {
        String requestId = request.getHeader("X-Request-ID");
        ErrorDetails errorDetails = new ErrorDetails("INTERNAL_SERVER_ERROR", "An unexpected error occurred", null);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.error(errorDetails, requestId));
    }
}
