package com.opensource.resturantfinder.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.Instant;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private String status;
    private T data;
    private ErrorDetails error;
    private String requestId;
    private Instant timestamp;

    private ApiResponse(String status, T data, ErrorDetails error, String requestId) {
        this.status = status;
        this.data = data;
        this.error = error;
        this.requestId = requestId;
        this.timestamp = Instant.now();
    }

    public static <T> ApiResponse<T> success(T data, String requestId) {
        return new ApiResponse<>("success", data, null, requestId);
    }

    public static <T> ApiResponse<T> error(ErrorDetails error, String requestId) {
        return new ApiResponse<>("error", null, error, requestId);
    }

    // Getters
    public String getStatus() { return status; }
    public T getData() { return data; }
    public ErrorDetails getError() { return error; }
    public String getRequestId() { return requestId; }
    public Instant getTimestamp() { return timestamp; }
}