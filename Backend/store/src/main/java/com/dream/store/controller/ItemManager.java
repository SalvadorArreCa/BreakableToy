package com.dream.store.controller;
import com.dream.store.entity.Items;
import com.dream.store.entity.Metrics;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.io.File;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;;

@RestController
public class ItemManager {
    
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

    @GetMapping(path = "/products")
    @CrossOrigin(origins = "http://localhost:8080")
    public List<Items> getProducts( @RequestParam Integer page, 
                                    @RequestParam(required = false) Integer sort,
                                    @RequestParam(required = false) boolean invert,
                                    @RequestParam(required = false) List<String> category,
                                    @RequestParam(required = false) String name,
                                    @RequestParam(required = false) Integer stock
                                    ){
        try {
            List<Items> catalogue = Catalogue();
            if(category != null) catalogue = filteringCategory(catalogue, category);
            if(name != null) catalogue = filteringName(catalogue, name);
            if(stock != null) catalogue = filteringStock(catalogue, stock);
            if(sort != null) sorting(catalogue, sort);
            if(invert) Collections.reverse(catalogue);
            int[] range = pagination(page);
            if(range[1] > catalogue.size()) range[1] = catalogue.size();

            List<Items> products = catalogue.subList(range[0], range[1]);

            return products;
        } catch (Exception ina) {
            ina.printStackTrace();
            return null;
        }
    }

    @GetMapping(path = "/catalogueSize")
    @CrossOrigin(origins = "http://localhost:8080")
    public ResponseEntity<Map<String,Integer>> catalogueSize(){
        Map<String, Integer> response = new HashMap<>();
        response.put("data", Catalogue().size());
        return ResponseEntity.ok(response);    
    }

    @PostMapping(path = "/products")
    @CrossOrigin(origins = "http://localhost:8080")
    public ResponseEntity<Map<String, String>> addProduct(@RequestBody Items product){
        List<Items> Catalogue = Catalogue();
        Map<String, String> response = new HashMap<>();
        try {
            if(product != null){
                Catalogue.add(product);
                writeCatalogue(Catalogue);
                response.put("message", "Producto Agregado Correctamente >w<");
                return ResponseEntity.ok(response);
            }
            else {
                response.put("message","El producto llego vacio");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }
        } catch (Exception ina) {
            ina.printStackTrace();
            response.put("message","Error al agregar el producto");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }  
    }

    @GetMapping(path = "/categories")
    @CrossOrigin(origins = "http://localhost:8080")
    public List<Metrics> Categories(){
        List<Items> Catalogue = Catalogue();
        List<String> Categories = new ArrayList<>();
        List<Metrics> metrics = new ArrayList<>();

        for(Items item : Catalogue){
            if(!Categories.contains(item.getCategory())){
                Categories.add(item.getCategory());
                metrics.add(metrics(Catalogue, item.getCategory()));
            }
        }
        return metrics;
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

    @DeleteMapping(path = "/delete/{id}")
    @CrossOrigin(origins = "http://localhost:8080")
    public ResponseEntity<Map<String, String>> deleteProduct(@PathVariable int id){
        List<Items> catalogue = Catalogue();
        Map<String, String> response = new HashMap<>();
        
        try {
            catalogue.removeIf(item -> item.getId() == id);
            writeCatalogue(catalogue);
            response.put("message", "El Producto se elimino correctamente");
            return ResponseEntity.ok(response);
        } catch (Exception ina) {
            ina.printStackTrace();
            response.put("message", "El producto no se pudo eliminar");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping(path = "/products/{id}")
    @CrossOrigin(origins = "http://localhost:8080")
    public ResponseEntity<Map<String, String>> editProduct(@RequestBody Items editedItem, @PathVariable int id){
        List<Items> catalogue = Catalogue();
        Map<String, String> response = new HashMap<>();
        try {
            for(Items item : catalogue){
                if(item.getId() == editedItem.getId()){
                    item.setCategory(editedItem.getCategory());
                    item.setName(editedItem.getName());
                    item.setPrice(editedItem.getPrice());
                    item.setStock(editedItem.getStock());
                    item.setExpirationDate(editedItem.getExpirationDate());
                    item.setUpdateDate(editedItem.getUpdateDate());
                }
            }
            writeCatalogue(catalogue);
            response.put("message", "El producto se edito correctamente >w<");
            return ResponseEntity.ok(response);
        } catch (Exception ina) {
            ina.printStackTrace();
            response.put("message", "No se pudo editar el producto");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping(path = "/products/{id}/out-of-stock")
    @CrossOrigin(origins = "http://localhost:8080")
    public ResponseEntity<Map<String,String>> outOfStock(@PathVariable int id){
        List<Items> catalogue = Catalogue();
        Map<String, String> response = new HashMap<>();

        try {
            for(Items item : catalogue){
                if(item.getId() == id) {
                    item.setStock(0);
                }
            }
            writeCatalogue(catalogue);
            response.put("message","El Stock se termino para el producto");
            return ResponseEntity.ok(response);
        } catch (Exception ina) {
            ina.printStackTrace();
            response.put("message","No se pudo editar el producto");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping(path = "/catalogue/create")
    public void createCatalogue(){
        List<Items> Catalogo = new ArrayList<>();
        Catalogo = Items.createCatalogue();
        ObjectMapper mapper = new ObjectMapper();
        try{
            mapper.writeValue(new File("src/main/resources/catalogo.json"), Catalogo);
            System.out.println("Catalogo creado >w<");
        }
        catch(Exception ina){
            ina.printStackTrace();
        }
    }
    
}
