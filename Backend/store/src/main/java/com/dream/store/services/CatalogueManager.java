package com.dream.store.services;

import java.io.File;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import com.dream.store.entity.Items;
import com.dream.store.entity.Metrics;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

public class CatalogueManager {
    public List<Items> Catalogue() {
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.readValue(new File("src/main/resources/catalogo.json"), new TypeReference<List<Items>>() {});
        } catch (Exception ina) {
            ina.printStackTrace();
            return null;
        }
    }

    public int[] pagination(int page){
        int bottomValue = 0 + (page * 10);
        int topValue = 10 + (page * 10);

        int[] range = {bottomValue, topValue};

        return range;
    }

    public void sorting(List<Items> catalogue, int value){
        switch(value){
            //Sort by Id
            case 1: 
                catalogue.sort(Comparator.comparingLong(item -> item.getId()));
                break;
            //Sort by Category
            case 2:
                catalogue.sort(Comparator.comparing(item -> item.getCategory()));
                break;
            //Sort by Name
            case 3:
                catalogue.sort(Comparator.comparing(item -> item.getName()));
                break;
            //Sort by Price
            case 4:
                catalogue.sort(Comparator.comparingDouble(item -> item.getPrice()));
                break;
            //Sort by Stock
            case 5:
                catalogue.sort(Comparator.comparingInt(item -> item.getStock()));
                break;
            //Sort by Expiration Date
            case 6:
                catalogue.sort(Comparator.comparing(item -> item.getExpirationDate()));
                break;
        }
    }

    public List<Items> filteringCategory(List<Items> catalogue, List<String> filters){
        List<Items> filteredCaralogue = new ArrayList<>();
        for(String filter : filters){
            for(Items item : catalogue){
                if(filter.equals(item.getCategory())){
                    filteredCaralogue.add(item);
                }
            }
        }
        return filteredCaralogue;
    }

    public List<Items> filteringName(List<Items> catalogue, String name){
        List<Items> filteredCatalogue = new ArrayList<>();
        for(Items item : catalogue){
            name = name.toLowerCase();
            if((item.getName().toLowerCase()).contains(name)){
                filteredCatalogue.add(item);
            }
        }
        return filteredCatalogue;
    }
    
    public List<Items> filteringStock(List<Items> catalogue, int stock){
        List<Items> filteredCatalogue = new ArrayList<>();
        for(Items item : catalogue){
            if(stock == 0 && item.getStock() == 0){
                filteredCatalogue.add(item); 
            }
            else if(stock == 1 && item.getStock() > 0) {
                filteredCatalogue.add(item); 
            }
        }
        return filteredCatalogue.isEmpty() ? new ArrayList<>(catalogue) : filteredCatalogue;
    }

    public Metrics metrics(List<Items> catelogue, String category){
        int totalStock = 0;
        double totalValue = 0;
        double averageValue = 0;
        for(Items item : catelogue){
            if(item.getCategory().equals(category)) {
                totalStock += item.getStock();
                totalValue += item.getPrice();
                averageValue++;
            }
        }
        averageValue = totalValue / averageValue;
        return new Metrics(category,totalStock,totalValue, averageValue);
    }

    public void writeCatalogue(List<Items> Catalogue){
        ObjectMapper mapper = new ObjectMapper();
        try {
            mapper.writeValue(new File("src/main/resources/catalogo.json"), Catalogue);
        } catch (Exception ina) {
            ina.printStackTrace();
        }
    }

    //Inicializar valores
    public List<Items> createCatalogue(){
        List<Items> Catalogue = new ArrayList<>();

        Catalogue.add(new Items(1,"Comida", "Yogurt", 10.0, 10, "2025-06-30", "2025-06-30",""));
        Catalogue.add(new Items(2,"Comida", "Mermelada", 80.0, 5, "2025-8-10", "2025-06-5", "2025-06-10"));
        Catalogue.add(new Items(3,"Comida", "Rajas", 50.0, 10, "2025-8-5", "2025-06-10", ""));
        Catalogue.add(new Items(4,"Comida", "Manzana", 10.0, 30, "2025-06-25", "2025-06-10", ""));
        Catalogue.add(new Items(5,"Ropa", "Pantalon", 500.0, 3, "", "2025-05-15", "2025-06-10"));
        Catalogue.add(new Items(6,"Ropa", "Playera", 150.0, 10,"","2025-05-15", "2025-06-08"));
        Catalogue.add(new Items(7,"Herramientas", "Martillo", 300.0, 10, "", "2024-12-15", "2025-03-13"));
        Catalogue.add(new Items(8,"Papeleria", "Pluma gel", 75.0, 0, "", "2025-05-15", "2025-06-10"));

        return Catalogue;
    }
}
