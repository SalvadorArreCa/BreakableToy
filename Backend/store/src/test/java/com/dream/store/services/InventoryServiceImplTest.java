package com.dream.store.services;

import com.dream.store.dtos.ItemsDTO;
import com.dream.store.dtos.MetricsDTO;
import com.dream.store.dtos.ProductsPageDTO;
import com.dream.store.exceptions.ItemNotFoundException;
import com.dream.store.repositories.ItemsRepository;
import com.dream.store.util.CatalogueFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.util.List;

public class InventoryServiceImplTest {

    private ItemsRepository repo;
    private InventoryServiceImpl service;

    @BeforeEach
    public void seedCache() {
        repo = Mockito.mock(ItemsRepository.class);
        service = new InventoryServiceImpl(repo);

        List<ItemsDTO> catalogue = CatalogueFactory.createCatalogue();
        when(repo.findAll()).thenReturn(catalogue);

        // Simulate @PostConstruct
        try {
            var method = InventoryServiceImpl.class.getDeclaredMethod("loadCache");
            method.setAccessible(true);
            method.invoke(service);
        } catch (Exception e) {
            fail("Failed to invoke loadCache via reflection");
        }
    }

    @Test
    void getProducts_firstPage_noFilters() {
        ProductsPageDTO result = service.getProducts(0,null, null, null, null, null);

        assertNotNull(result);
        assertEquals(8, result.getCatalogueSize());
        assertEquals(8, result.getProducts().size());
    }

    @Test
    void getProducts_filterByCategory() {
        ProductsPageDTO result = service.getProducts(0, null, null, List.of("Comida"), null, null);

        assertEquals(4, result.getProducts().size());
        for (ItemsDTO item : result.getProducts()) assertEquals("Comida", item.getCategory());
    }

    @Test
    void getProducts_filterByNamePartial() {
        ProductsPageDTO result = service.getProducts(0, null, null, null, "me", null);

        assertEquals(1, result.getProducts().size());
        assertEquals("Mermelada", result.getProducts().getFirst().getName());
    }

    @Test
    void getProducts_filtersByStockZero() {
        ProductsPageDTO result = service.getProducts(0, null, null, null, null, 0);

        assertEquals(1, result.getProducts().size());
        assertEquals(0, result.getProducts().get(0).getStock());
    }

    @Test
    void getProducts_filtersByStockGreaterThanZero() {
        ProductsPageDTO result = service.getProducts(0, null, null, null, null, 1);

        assertEquals(7, result.getProducts().size());
        for (ItemsDTO item : result.getProducts()) {
            assertTrue(item.getStock() >= 1);
        }
    }

    @Test
    void getProducts_combinedFilters() {
        ProductsPageDTO result = service.getProducts(0, null, null, List.of("Comida"), "a", 1);

        assertEquals(3, result.getProducts().size());
        for (ItemsDTO item : result.getProducts()) {
            assertEquals("Comida", item.getCategory());
            assertTrue(item.getName().toLowerCase().contains("a"));
            assertTrue(item.getStock() >= 1);
        }
    }

    @Test
    void getProducts_sortsById() {
        ProductsPageDTO result = service.getProducts(0, 1, null, null, null, null);

        assertEquals(8, result.getProducts().size());
        assertEquals(1, result.getProducts().get(0).getId());
        assertEquals(8, result.getProducts().get(7).getId());
    }

    @Test
    void getProducts_sortsByNameInverted() {
        ProductsPageDTO result = service.getProducts(0, 3, true, null, null, null);

        assertEquals(8, result.getProducts().size());
        assertEquals("Yogurt", result.getProducts().get(0).getName());
    }

    @Test
    void getProducts_pagination() {
        ProductsPageDTO result = service.getProducts(1, null, null, null, null, null);

        assertEquals(8, result.getCatalogueSize());
        assertEquals(0, result.getProducts().size());
    }

    //Add Product

    @Test
    void addProduct_assignsNextIdAndSaves() {
        ItemsDTO newItem = new ItemsDTO(0, "Papeleria", "Cuaderno", 50.0, 5, "", "", "");
        ItemsDTO added = service.addProduct(newItem);

        assertEquals(9, added.getId());  // Since catalogue originally had 8 items
        assertNotNull(added.getCreationDate());
        verify(repo, times(1)).saveAll(anyList());
    }

    @Test
    void addProduct_preservesGivenCreationDate() {
        ItemsDTO newItem = new ItemsDTO(0, "Papeleria", "Marcador", 20.0, 3, "", "2024-01-01", "");
        ItemsDTO added = service.addProduct(newItem);

        assertEquals("2024-01-01", added.getCreationDate());
    }

    //Delete Product
    @Test
    void deleteProduct_removesExistingItem() {
        service.deleteProduct(1);
        verify(repo, times(1)).saveAll(anyList());
    }

    @Test
    void deleteProduct_throwsIfNotFound() {
        assertThrows(ItemNotFoundException.class, () -> service.deleteProduct(999));
        verify(repo, never()).saveAll(anyList());
    }

    //Update Product

    void updateProduct_modifiesFieldsAndSaves() {
        ItemsDTO edited = new ItemsDTO(0, "Comida", "Nuevo Yogurt", 15.0, 20, "2026-01-01", "", "");
        ItemsDTO updated = service.updateProduct(1, edited);

        assertEquals("Nuevo Yogurt", updated.getName());
        assertEquals(15.0, updated.getPrice());
        verify(repo, times(1)).saveAll(anyList());
    }

    @Test
    void updateProduct_setsUpdateDateIfEmpty() {
        ItemsDTO edited = new ItemsDTO(0, "Comida", "Nuevo Yogurt", 15.0, 20, "2026-01-01", "", "");
        ItemsDTO updated = service.updateProduct(1, edited);

        assertEquals(LocalDate.now().toString(), updated.getUpdateDate());
    }

    @Test
    void updateProduct_throwsIfNotFound() {
        ItemsDTO edited = new ItemsDTO(0, "X", "X", 0, 0, "", "", "");
        assertThrows(ItemNotFoundException.class, () -> service.updateProduct(999, edited));
        verify(repo, never()).saveAll(anyList());
    }

    //Stock Update

    @Test
    void setOutOfStock_setsStockToZero() {
        service.setOutOfStock(1);
        ItemsDTO item = service.getProducts(0, null, null, null, null, null).getProducts().stream()
                .filter(i -> i.getId() == 1).findFirst().orElse(null);
        assertNotNull(item);
        assertEquals(0, item.getStock());
    }

    @Test
    void restock_setsStockToTen() {
        service.restock(1);
        ItemsDTO item = service.getProducts(0, null, null, null, null, null).getProducts().stream()
                .filter(i -> i.getId() == 1).findFirst().orElse(null);
        assertNotNull(item);
        assertEquals(10, item.getStock());
    }

    @Test
    void stockUpdate_throwsIfNotFound() {
        assertThrows(ItemNotFoundException.class, () -> service.setOutOfStock(999));
        assertThrows(ItemNotFoundException.class, () -> service.restock(999));
    }

    //Metrics

    @Test
    void getCategoriesWithMetrics_returnsCorrectTotals() {
        List<MetricsDTO> metrics = service.getCategoriesWithMetrics();

        MetricsDTO comida = metrics.stream().filter(m -> m.getCategoryMetrics().equals("Comida")).findFirst().orElse(null);
        assertNotNull(comida);
        assertEquals(10 + 5 + 10 + 30, comida.getTotalStock());
        assertTrue(comida.getTotalValue() > 0);
    }
}
