package com.medicalrecordsservice.mrs.exception;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.medicalrecordsservice.mrs.util.ApiResponse;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleException(Exception ex) {
        return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, ex.getMessage(), null));
    }
}
