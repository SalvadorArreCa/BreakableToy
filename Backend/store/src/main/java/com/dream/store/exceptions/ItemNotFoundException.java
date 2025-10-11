package com.dream.store.exceptions;

public class ItemNotFoundException extends RuntimeException {
    public ItemNotFoundException(long id){
        super("Item not found with id: " + id);
    }
}
