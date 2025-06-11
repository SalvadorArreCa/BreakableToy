package com.dream.store.controller;
import com.dream.store.entity.Items;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;

import java.util.ArrayList;
import java.util.List;
import java.io.File;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;;

@RestController
public class ItemManager {
    
    @GetMapping(path = "/products")
    @CrossOrigin(origins = "http://localhost:8080")
    public List<Items> Catalogo() {
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.readValue(new File("src/main/resources/catalogo.json"), new TypeReference<List<Items>>() {});
        } catch (Exception ina) {
            ina.printStackTrace();
            return null;
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
