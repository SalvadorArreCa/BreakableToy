package com.dream.store.controller;
import com.dream.store.entity.Items;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.io.File;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;;

@RestController
public class ItemManager {
    
    @GetMapping(path = "/products")
    @CrossOrigin(origins = "http://localhost:8080")
    public List<Items> Catalogue() {
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.readValue(new File("src/main/resources/catalogo.json"), new TypeReference<List<Items>>() {});
        } catch (Exception ina) {
            ina.printStackTrace();
            return null;
        }
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
    public List<String> Categories(){
        List<Items> Catalogue = Catalogue();
        List<String> Categories = new ArrayList<>();

        for(Items item : Catalogue){
            if(!Categories.contains(item.getCategory())){
                Categories.add(item.getCategory());
            }
        }
        return Categories;
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
