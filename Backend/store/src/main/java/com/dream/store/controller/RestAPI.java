package com.dream.store.controller;
import com.dream.store.entity.Items;
import com.dream.store.entity.Metrics;
import com.dream.store.services.CatalogueManager;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.Collections;
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
public class RestAPI {

    private CatalogueManager CatMan = new CatalogueManager();

    @GetMapping(path = "/products")
    @CrossOrigin(origins = "http://localhost:8080")
    public ResponseEntity<Map<String, Object>> getProducts( @RequestParam Integer page, 
                                    @RequestParam(required = false) Integer sort,
                                    @RequestParam(required = false) boolean invert,
                                    @RequestParam(required = false) List<String> category,
                                    @RequestParam(required = false) String name,
                                    @RequestParam(required = false) Integer stock
                                    ){
        try {
            List<Items> catalogue = CatMan.Catalogue();
            if(category != null) catalogue = CatMan.filteringCategory(catalogue, category);
            if(name != null) catalogue = CatMan.filteringName(catalogue, name);
            if(stock != null) catalogue = CatMan.filteringStock(catalogue, stock);
            if(sort != null) CatMan.sorting(catalogue, sort);
            if(invert) Collections.reverse(catalogue);
            int[] range = CatMan.pagination(page);
            if(range[1] > catalogue.size()) range[1] = catalogue.size();

            List<Items> products = catalogue.subList(range[0], range[1]);
            Map<String, Object> response = new HashMap<>();
            response.put("products", products);
            response.put("catalogueSize", catalogue.size());
            return ResponseEntity.ok(response);
        } catch (Exception ina) {
            ina.printStackTrace();
            return ResponseEntity.status(501).body(null);
        }
    }

    @PostMapping(path = "/products")
    @CrossOrigin(origins = "http://localhost:8080")
    public ResponseEntity<Map<String, String>> addProduct(@RequestBody Items product){
        List<Items> catalogue = CatMan.Catalogue();
        Map<String, String> response = new HashMap<>();
        try {
            if(product != null){
                long nextId = catalogue.stream()
                                  .mapToLong(Items::getId)
                                  .max()
                                  .orElse(0) + 1;

                product.setId(nextId);
                catalogue.add(product);
                CatMan.writeCatalogue(catalogue);
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
        List<Items> Catalogue = CatMan.Catalogue();
        List<String> Categories = new ArrayList<>();
        List<Metrics> metrics = new ArrayList<>();

        for(Items item : Catalogue){
            if(!Categories.contains(item.getCategory())){
                Categories.add(item.getCategory());
                metrics.add(CatMan.metrics(Catalogue, item.getCategory()));
            }
        }
        return metrics;
    }  

    @DeleteMapping(path = "/delete/{id}")
    @CrossOrigin(origins = "http://localhost:8080")
    public ResponseEntity<Map<String, String>> deleteProduct(@PathVariable int id){
        List<Items> catalogue = CatMan.Catalogue();
        Map<String, String> response = new HashMap<>();
        
        try {
            catalogue.removeIf(item -> item.getId() == id);
            CatMan.writeCatalogue(catalogue);
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
        List<Items> catalogue = CatMan.Catalogue();
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
            CatMan.writeCatalogue(catalogue);
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
        List<Items> catalogue = CatMan.Catalogue();
        Map<String, String> response = new HashMap<>();

        try {
            for(Items item : catalogue){
                if(item.getId() == id) {
                    item.setStock(0);
                }
            }
            CatMan.writeCatalogue(catalogue);
            response.put("message","El Stock se termino para el producto");
            return ResponseEntity.ok(response);
        } catch (Exception ina) {
            ina.printStackTrace();
            response.put("message","No se pudo editar el producto");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping(path = "/products/{id}/re-stock")
    @CrossOrigin(origins = "http://localhost:8080")
    public ResponseEntity<Map<String,String>> reStock(@PathVariable int id){
        List<Items> catalogue = CatMan.Catalogue();
        Map<String, String> response = new HashMap<>();

        try {
            for(Items item : catalogue){
                if(item.getId() == id) {
                    item.setStock(10);
                }
            }
            CatMan.writeCatalogue(catalogue);
            response.put("message","El se reestablecio el stock del producto");
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
        Catalogo = CatMan.createCatalogue();
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
