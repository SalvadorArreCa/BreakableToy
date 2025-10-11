package com.dream.store.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleAllExceptions(Exception ex, WebRequest req) {
        ApiError apiError = new ApiError(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Internal Server Error",
                ex.getMessage(),
                req.getDescription(false)
        );

        return new ResponseEntity<>(apiError, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(ItemNotFoundException.class)
    public ResponseEntity<ApiError> handleProductNotFound(ItemNotFoundException ex, WebRequest req) {
        ApiError apiError = new ApiError(
                HttpStatus.NOT_FOUND.value(),
                "Product not found",
                ex.getMessage(),
                req.getDescription(false)
        );

        return new ResponseEntity<>(apiError, HttpStatus.NOT_FOUND);
    }

}
