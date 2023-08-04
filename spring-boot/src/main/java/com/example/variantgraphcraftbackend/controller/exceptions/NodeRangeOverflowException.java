package com.example.variantgraphcraftbackend.controller.exceptions;

public class NodeRangeOverflowException extends Exception{

    private int statusCode;
    private String message;

    public NodeRangeOverflowException(String message, int statusCode) {
        this.message = message;
        this.statusCode = statusCode;
    }

    public int getStatusCode() {
        return this.statusCode;
    }

    public String getMessage() {
        return this.message;
    }
}
