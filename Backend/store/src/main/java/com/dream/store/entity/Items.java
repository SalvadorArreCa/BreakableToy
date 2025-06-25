package com.dream.store.entity;
import lombok.NoArgsConstructor;

@NoArgsConstructor
public class Items {
    private long id;
    private String category;
    private String name;
    private double price;
    private int stock;
    private String expiration_date;
    private String creation_date;
    private String update_date;

    //Constructor
    public Items(long id, String category, String name, double price, int stock, String expiration_date, String creation_date, String update_date){
        this.id = id;
        this.category = category;
        this.name = name;
        this.price = price;
        this.stock = stock;
        this.expiration_date = expiration_date;
        this.creation_date = creation_date;
        this.update_date = update_date;
    }

    //Getters
    public long getId(){ return id; }
    public String getName(){ return name; }
    public String getCategory(){ return category; }
    public double getPrice(){ return price; }
    public int getStock(){ return stock; }
    public String getExpirationDate(){ return expiration_date; }
    public String getCreationDate(){ return creation_date; }
    public String getUpdateDate(){ return update_date; }

    //Setters
    public void setId(long id){ this.id = id; }
    public void setName(String name){ this.name = name; }
    public void setCategory(String category){ this.category = category; }
    public void setPrice(double price){ this.price = price; }
    public void setStock(int stock){ this.stock = stock; }
    public void setExpirationDate(String date){this.expiration_date = date; }
    public void setCreationDate(String date){ this.creation_date = date; }
    public void setUpdateDate(String date){this.update_date = date;}
}
