package com.dream.store;
import java.util.ArrayList;
import java.util.List;

import com.dream.store.entity.Items;
import com.dream.store.entity.Metrics;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertArrayEquals;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import com.dream.store.services.CatalogueManager;

@SpringBootTest
public class CatalogueManagerTest {
    
    @Test
    void testPagination_n1(){
        CatalogueManager CatMan = new CatalogueManager();
        int[] result = CatMan.pagination(0);
        assertArrayEquals(new int[]{0,10}, result);
    }

    @Test
    void testPagination_n2(){
        CatalogueManager CatMan = new CatalogueManager();
        int[] result = CatMan.pagination(1);
        assertArrayEquals(new int[]{10,20}, result);
    }

    @Test
    void testSortingById(){
        CatalogueManager CatMan = new CatalogueManager();
        List<Items> sampleItems = new ArrayList<>(CatMan.createCatalogue());
        CatMan.sorting(sampleItems, 1);
        assertEquals(1, sampleItems.get(0).getId());
        assertEquals(2, sampleItems.get(1).getId());
        assertEquals(3, sampleItems.get(2).getId());
        assertEquals(4, sampleItems.get(3).getId());
        assertEquals(5, sampleItems.get(4).getId());
        assertEquals(6, sampleItems.get(5).getId());
        assertEquals(7, sampleItems.get(6).getId());
        assertEquals(8, sampleItems.get(7).getId());
    }

    @Test
    void testSortingByCategory(){
        CatalogueManager CatMan = new CatalogueManager();
        List<Items> sampleItems = new ArrayList<>(CatMan.createCatalogue());
        CatMan.sorting(sampleItems, 2);
        for(Items items : sampleItems){
            System.out.println(items);
        }
        assertEquals("Comida", sampleItems.get(0).getCategory());
        assertEquals("Comida", sampleItems.get(1).getCategory());
        assertEquals("Comida", sampleItems.get(2).getCategory());
        assertEquals("Comida", sampleItems.get(3).getCategory());
        assertEquals("Herramientas", sampleItems.get(4).getCategory());
        assertEquals("Papeleria", sampleItems.get(5).getCategory());
        assertEquals("Ropa", sampleItems.get(6).getCategory());
        assertEquals("Ropa", sampleItems.get(7).getCategory());
    }

    @Test
    void testSortingByName(){
        CatalogueManager CatMan = new CatalogueManager();
        List<Items> sampleItems = new ArrayList<>(CatMan.createCatalogue());
        CatMan.sorting(sampleItems, 3);
        assertEquals("Manzana", sampleItems.get(0).getName());
        assertEquals("Martillo", sampleItems.get(1).getName());
        assertEquals("Mermelada", sampleItems.get(2).getName());
        assertEquals("Pantalon", sampleItems.get(3).getName());
        assertEquals("Playera", sampleItems.get(4).getName());
        assertEquals("Pluma gel", sampleItems.get(5).getName());
        assertEquals("Rajas", sampleItems.get(6).getName());
        assertEquals("Yogurt", sampleItems.get(7).getName());
    }

    @Test
    void testSortingByPrice(){
        CatalogueManager CatMan = new CatalogueManager();
        List<Items> sampleItems = new ArrayList<>(CatMan.createCatalogue());
        CatMan.sorting(sampleItems, 4);
        assertEquals(10.0, sampleItems.get(0).getPrice());
        assertEquals(10.0, sampleItems.get(1).getPrice());
        assertEquals(50.0, sampleItems.get(2).getPrice());
        assertEquals(75.0, sampleItems.get(3).getPrice());
        assertEquals(80.0, sampleItems.get(4).getPrice());
        assertEquals(150.0, sampleItems.get(5).getPrice());
        assertEquals(300.0, sampleItems.get(6).getPrice());
        assertEquals(500.0, sampleItems.get(7).getPrice());
    }

    @Test
    void testSortingByStock(){
        CatalogueManager CatMan = new CatalogueManager();
        List<Items> sampleItems = new ArrayList<>(CatMan.createCatalogue());
        CatMan.sorting(sampleItems, 5);
        assertEquals(0, sampleItems.get(0).getStock());
        assertEquals(3, sampleItems.get(1).getStock());
        assertEquals(5, sampleItems.get(2).getStock());
        assertEquals(10, sampleItems.get(3).getStock());
        assertEquals(10, sampleItems.get(4).getStock());
        assertEquals(10, sampleItems.get(5).getStock());
        assertEquals(10, sampleItems.get(6).getStock());
        assertEquals(30, sampleItems.get(7).getStock());
    }

    @Test
    void testFilterByName(){
        CatalogueManager CatMan = new CatalogueManager();
        List<Items> sampleItems = new ArrayList<>(CatMan.createCatalogue());
        List<Items> filtered = new ArrayList<>();
        filtered = CatMan.filteringName(sampleItems, "MAN");

        assertEquals("Manzana", filtered.get(0).getName());
    }

    @Test
    void testFilterByCategory(){
        CatalogueManager CatMan = new CatalogueManager();
        List<Items> sampleItems = new ArrayList<>(CatMan.createCatalogue());
        List<Items> filtered = new ArrayList<>();
        List<String> categories = new ArrayList<>();
        categories.add("Herramientas");
        filtered = CatMan.filteringCategory(sampleItems, categories);

        assertEquals("Martillo", filtered.get(0).getName());
    }

    @Test
    void testFilterByStock(){
        CatalogueManager CatMan = new CatalogueManager();
        List<Items> sampleItems = new ArrayList<>(CatMan.createCatalogue());
        List<Items> filtered = new ArrayList<>();
        filtered = CatMan.filteringStock(sampleItems, 0);

        assertEquals("Pluma gel", filtered.get(0).getName());
    }

    @Test
    void testMetrics(){
        CatalogueManager CatMan = new CatalogueManager();
        List<Items> sampleItems = new ArrayList<>(CatMan.createCatalogue());
        Metrics testMetrics = new Metrics("Ropa",13, 650.0, 325.0);

        assertEquals(testMetrics.getCategoryMetrics(), CatMan.metrics(sampleItems, "Ropa").getCategoryMetrics());
        assertEquals(testMetrics.getTotalStock(), CatMan.metrics(sampleItems, "Ropa").getTotalStock());
        assertEquals(testMetrics.getTotalValue(), CatMan.metrics(sampleItems, "Ropa").getTotalValue());
        assertEquals(testMetrics.getAverageValue(), CatMan.metrics(sampleItems, "Ropa").getAverageValue());
    }
}
