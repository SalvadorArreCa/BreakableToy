package com.dream.store.services;

import com.dream.store.dtos.ItemsDTO;
import com.dream.store.dtos.MetricsDTO;
import com.dream.store.dtos.ProductsPageDTO;

import java.util.List;

public interface InventoryService {
    ProductsPageDTO getProducts(int page,
                                Integer sort,
                                Boolean invert,
                                List<String> category,
                                String name,
                                Integer stock
                                );

    ItemsDTO addProduct(ItemsDTO product);
    void deleteProduct(long id);
    ItemsDTO updateProduct(long id, ItemsDTO editedItem);
    void setOutOfStock(long id);
    void restock(long id);
    List<MetricsDTO> getCategoriesWithMetrics();
}
