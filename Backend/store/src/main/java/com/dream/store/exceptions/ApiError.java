package com.dream.store.exceptions;

import java.time.LocalDateTime;

public class ApiError {
    private LocalDateTime timestamps;
    private int status;
    private String error;
    private String message;
    private String path;

    public ApiError(int status, String error, String message, String path) {
        this.timestamps = LocalDateTime.now();
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
    }

    public LocalDateTime getTimestamps() { return timestamps; }
    public int getStatus() { return status; }
    public String getError() { return error; }
    public String getMessage() { return message; }
    public String getPath() { return path; }

    public void setTimestamps(LocalDateTime timestamps) { this.timestamps = timestamps; }
    public void setStatus(int status) { this.status = status; }
    public void setError(String error) { this.error = error; }
    public void setMessage(String message) { this.message = message; }
    public void setPath(String path) { this.path = path; }
}
