package com.dream.store.entity;
import java.util.ArrayList;
import java.util.List;
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

    //Inicializar valores
    public static List<Items> createCatalogue(){
        List<Items> Catalogue = new ArrayList<>();

        Catalogue.add(new Items(1,"Comida", "Yogurt", 10.0, 10, "2025-06-30", "2025-06-30",null));
        Catalogue.add(new Items(2,"Comida", "Mermelada", 80.0, 5, "2025-8-10", "2025-06-5", "2025-06-10"));
        Catalogue.add(new Items(3,"Comida", "Rajas", 50.0, 10, "2025-8-5", "2025-06-10", null));
        Catalogue.add(new Items(4,"Comida", "Manzana", 10.0, 30, "2025-06-25", "2025-06-10", null));
        Catalogue.add(new Items(5,"Ropa", "Pantalon", 500.0, 3, null, "2025-05-15", "2025-06-10"));
        Catalogue.add(new Items(6,"Ropa", "Playera", 150.0, 10,null,"2025-05-15", "2025-06-08"));
        Catalogue.add(new Items(7,"Herramientas", "Martillo", 300.0, 10, null, "2024-12-15", "2025-03-13"));
        Catalogue.add(new Items(8,"Papeleria", "Pluma gel", 75.0, 0, null, "2025-05-15", "2025-06-10"));

        return Catalogue;
    }
}
