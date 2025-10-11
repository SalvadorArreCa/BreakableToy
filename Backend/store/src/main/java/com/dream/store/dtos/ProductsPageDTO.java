package com.dream.store.dtos;

import java.util.List;

public class ProductsPageDTO {
    private List<ItemsDTO> products;
    private int catalogueSize;

    public ProductsPageDTO() {};

    public ProductsPageDTO(List<ItemsDTO> products, int catalogueSize){
        this.products = products;
        this.catalogueSize = catalogueSize;
    }

    public List<ItemsDTO> getProducts() { return  products; }
    public int getCatalogueSize() { return catalogueSize; }

    public void setProducts(List<ItemsDTO> products) { this.products = products; }
    public void setCatalogueSize(int catalogueSize) { this.catalogueSize = catalogueSize; }
}
