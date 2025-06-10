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
    private String date;

    //Constructor
    public Items(long id, String category, String name, double price, int stock, String date){
        this.id = id;
        this.category = category;
        this.name = name;
        this.price = price;
        this.stock = stock;
        this.date = date;
    }

    //Getters
    public long getId(){ return id; }
    public String getName(){ return name; }
    public String getCategory(){ return category; }
    public double getPrice(){ return price; }
    public int getStock(){ return stock; }
    public String getDate(){ return date; }

    //Setters
    public void setId(long id){ this.id = id; }
    public void setName(String name){ this.name = name; }
    public void setCategory(String category){ this.category = category; }
    public void setPrice(double price){ this.price = price; }
    public void setStock(int stock){ this.stock = stock; }
    public void setDate(String date){this.date = date; }

    //Inicializar valores
    public static List<Items> inicializar(){
        List<Items> Catalogo = new ArrayList<>();

        Catalogo.add(new Items(1,"Comida", "Yogurt", 10.0, 10, "2026-06-30"));
        Catalogo.add(new Items(2,"Comida", "Mermelada", 80.0, 5, "2025-8-10"));
        Catalogo.add(new Items(3,"Comida", "Rajas", 50.0, 10, "2025-8-5"));
        Catalogo.add(new Items(4,"Comida", "Manzana", 10.0, 30, "2025-6-25"));
        Catalogo.add(new Items(5,"Ropa", "Pantalon", 500.0, 3, null));
        Catalogo.add(new Items(6,"Ropa", "Playera", 150.0, 10,null));
        Catalogo.add(new Items(7,"Herramientas", "Martillo", 300.0, 10, null));
        Catalogo.add(new Items(8,"Papeleria", "Pluma gel", 75.0, 0, null));

        return Catalogo;
    }

    public static void imprimirInfo(List<Items> Catalogo){
        System.out.println("Longitud del Catalogo: " + Catalogo.size());
        
        for(Items item : Catalogo){
            System.out.println( "Id: " + item.id +
                                "Categoria: " + item.category +
                                "Nombre: " + item.name + 
                                "Precio: " + item.price +
                                "Stock: " + item.stock +
                                "Fecha de Caducidad: " + item.date);
        }
    }
}
