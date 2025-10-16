package com.dream.store.util;

import com.dream.store.dtos.ItemsDTO;

import java.util.ArrayList;
import java.util.List;

public class CatalogueFactory {

    public static List<ItemsDTO> createCatalogue() {
        List<ItemsDTO> catalogue = new ArrayList<>();

        catalogue.add(new ItemsDTO(1,"Comida", "Yogurt", 10.0, 10, "2025-06-30", "2025-06-30",""));
        catalogue.add(new ItemsDTO(2,"Comida", "Mermelada", 80.0, 5, "2025-8-10", "2025-06-5", "2025-06-10"));
        catalogue.add(new ItemsDTO(3,"Comida", "Rajas", 50.0, 10, "2025-8-5", "2025-06-10", ""));
        catalogue.add(new ItemsDTO(4,"Comida", "Manzana", 10.0, 30, "2025-06-25", "2025-06-10", ""));
        catalogue.add(new ItemsDTO(5,"Ropa", "Pantalon", 500.0, 3, "", "2025-05-15", "2025-06-10"));
        catalogue.add(new ItemsDTO(6,"Ropa", "Playera", 150.0, 10,"","2025-05-15", "2025-06-08"));
        catalogue.add(new ItemsDTO(7,"Herramientas", "Martillo", 300.0, 10, "", "2024-12-15", "2025-03-13"));
        catalogue.add(new ItemsDTO(8,"Papeleria", "Pluma gel", 75.0, 0, "", "2025-05-15", "2025-06-10"));

        return catalogue;
    }
}
