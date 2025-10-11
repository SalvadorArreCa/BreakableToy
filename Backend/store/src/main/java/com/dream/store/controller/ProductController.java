package com.dream.store.controller;

import com.dream.store.dtos.ItemsDTO;
import com.dream.store.dtos.MetricsDTO;
import com.dream.store.dtos.ProductsPageDTO;
import com.dream.store.services.InventoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "http://localhost:8080")
public class ProductController {

    private final InventoryService service;

    public ProductController(InventoryService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ProductsPageDTO> getProducts(@RequestParam Integer page,
                                                       @RequestParam(required = false) Integer sort,
                                                       @RequestParam(required = false) Boolean invert,
                                                       @RequestParam(required = false) List<String> category,
                                                       @RequestParam(required = false) String name,
                                                       @RequestParam(required = false) Integer stock) {
        ProductsPageDTO result = service.getProducts(page, sort, invert, category, name, stock);
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<ItemsDTO> addProduct(@RequestBody ItemsDTO product) {
        ItemsDTO created = service.addProduct(product);
        return ResponseEntity.ok(created);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteProduct(@PathVariable long id) {
        service.deleteProduct(id);
        return ResponseEntity.ok(Map.of("message", "The product was deleted succesfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ItemsDTO> editProduct(@PathVariable long id, @RequestBody ItemsDTO editedItem) {
        ItemsDTO updated = service.updateProduct(id, editedItem);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/out-of-stock")
    public ResponseEntity<Map<String, String>> outOfStock(@PathVariable long id) {
        service.setOutOfStock(id);
        return ResponseEntity.ok(Map.of("message", "The item was put out of stock"));
    }

    @PutMapping("/{id}/re-stock")
    public ResponseEntity<Map<String, String>> restock(@PathVariable long id) {
        service.restock(id);
        return ResponseEntity.ok(Map.of("message", "The item was restocked"));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<MetricsDTO>> categories() {
        return ResponseEntity.ok(service.getCategoriesWithMetrics());
    }
}
