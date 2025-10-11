package com.dream.store.repositories;

import com.dream.store.dtos.ItemsDTO;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Repository;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

@Repository
public class JsonItemRepository implements ItemsRepository{

    private static final String FILE_PATH = "src/main/resources/catalogo.json";
    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public synchronized List<ItemsDTO> findAll() {
        try {
            File file = new File(FILE_PATH);
            if(!file.exists()) {
                return new ArrayList<>();
            }
            return mapper.readValue(file, new TypeReference<List<ItemsDTO>>() {});
        } catch (Exception e) {
            throw new RuntimeException("Error reading JSON file: " + FILE_PATH, e);
        }
    }

    @Override
    public synchronized void saveAll(List<ItemsDTO> items){
        try {
            mapper.writerWithDefaultPrettyPrinter().writeValue(new File(FILE_PATH), items);
        } catch (Exception e) {
            throw new RuntimeException("Error writing JSON file: ", e);
        }
    }
}
