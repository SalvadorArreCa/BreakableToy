package com.dream.store.services;

import com.dream.store.dtos.ItemsDTO;
import com.dream.store.dtos.MetricsDTO;
import com.dream.store.dtos.ProductsPageDTO;
import com.dream.store.exceptions.ItemNotFoundException;
import com.dream.store.repositories.ItemsRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class InventoryServiceImpl implements InventoryService {

    private final ItemsRepository repository;
    private static final int PAGE_SIZE = 10;

    public InventoryServiceImpl(ItemsRepository repository){
        this.repository = repository;
    }
    @Override
    public ProductsPageDTO getProducts(int page,
                                Integer sort,
                                Boolean invert,
                                List<String> category,
                                String name,
                                Integer stock
    ){
        List<ItemsDTO> catalogue = repository.findAll();

        if (category != null && !category.isEmpty()) {
            Set<String> catSet = new HashSet<>(category);
            catalogue = catalogue.stream()
                    .filter(item -> item.getCategory() != null && catSet.contains(item.getCategory()))
                    .collect(Collectors.toList());
        }

        if (name != null && !name.isEmpty()) {
            String q = name.toLowerCase();
            catalogue = catalogue.stream()
                    .filter(item -> item.getName() != null && item.getName().toLowerCase().contains(q))
                    .collect(Collectors.toList());
        }

        if (stock != null) {
            if (stock == 0) {
                catalogue = catalogue.stream().filter(item -> item.getStock() == 0)
                        .collect(Collectors.toList());
            } else if (stock == 1) {
                catalogue = catalogue.stream().filter(item -> item.getStock() >= 1)
                        .collect(Collectors.toList());
            }
        }

        if (sort != null) {
            Comparator<ItemsDTO> comparator = getComparatorForSort(sort);
            if (comparator != null) {
                catalogue.sort(comparator);
            }
        }

        if (Boolean.TRUE.equals(invert)) {
            Collections.reverse(catalogue);
        }

        int catalogueSize = catalogue.size();
        int from = Math.max(0, Math.min(page * PAGE_SIZE, catalogueSize));
        int to = Math.min(from + PAGE_SIZE, catalogueSize);

        List<ItemsDTO> pageItems = catalogue.subList(from, to);

        return new ProductsPageDTO(pageItems, catalogueSize);
    }

    @Override
    public synchronized ItemsDTO addProduct(ItemsDTO product) {
        List<ItemsDTO> catalogue = repository.findAll();
        long nextId = catalogue.stream().mapToLong(ItemsDTO::getId).max().orElse(0) + 1;
        product.setId(nextId);

        if (product.getCreationDate() == null || product.getCreationDate().isEmpty()) {
            product.setCreationDate(LocalDateTime.now().toString());
        }

        catalogue.add(product);
        repository.saveAll(catalogue);
        return product;
    }

    @Override
    public synchronized void deleteProduct(long id) {
        List<ItemsDTO> catalogue = repository.findAll();
        boolean removed = catalogue.removeIf(item -> item.getId() == id);
        if (!removed) throw new ItemNotFoundException(id);
        repository.saveAll(catalogue);
    }

    @Override
    public synchronized ItemsDTO updateProduct(long id, ItemsDTO editedItem) {
        List<ItemsDTO> catalogue = repository.findAll();
        Optional<ItemsDTO> found = catalogue.stream().filter(item -> item.getId() == id).findFirst();
        if (found.isEmpty()) throw new ItemNotFoundException(id);

        ItemsDTO item = found.get();

        item.setCategory(editedItem.getCategory());
        item.setName(editedItem.getName());
        item.setPrice(editedItem.getPrice());
        item.setStock(editedItem.getStock());
        item.setExpirationDate(editedItem.getExpirationDate());
        item.setUpdateDate(editedItem.getUpdateDate() == null || editedItem.getUpdateDate().isEmpty()
                        ? LocalDate.now().toString() : editedItem.getUpdateDate());

        repository.saveAll(catalogue);
        return item;
    }

    @Override
    public synchronized void setOutOfStock(long id) {
        updateStockAndSave(id, 0);
    }

    @Override
    public synchronized void restock(long id){
        updateStockAndSave(id, 10);
    }

    @Override
    public List<MetricsDTO> getCategoriesWithMetrics() {
        List<ItemsDTO> catalogue = repository.findAll();
        Map<String, List<ItemsDTO>> grouped = catalogue.stream()
                .filter(item -> item.getCategory() != null)
                .collect(Collectors.groupingBy(ItemsDTO::getCategory));

        List<MetricsDTO> metrics = new ArrayList<>();

        for (Map.Entry<String, List<ItemsDTO>> e : grouped.entrySet()) {
            String category = e.getKey();
            List<ItemsDTO> items = e.getValue();
            int totalStock = items.stream().mapToInt(ItemsDTO::getStock).sum();
            double totalValue = items.stream().mapToDouble(item -> item.getPrice() * item.getStock()).sum();
            double averageValue = totalStock > 0 ? (totalValue / totalStock) : 0.0;
            metrics.add(new MetricsDTO(category, totalStock, totalValue, averageValue));
        }

        return metrics;
    }

    private void updateStockAndSave(long id, int newStock) {
        List<ItemsDTO> catalogue = repository.findAll();
        Optional<ItemsDTO> found = catalogue.stream().filter(item -> item.getId() == id).findFirst();
        if (found.isEmpty()) throw new ItemNotFoundException(id);
        ItemsDTO item = found.get();
        item.setStock(newStock);
        item.setUpdateDate(LocalDate.now().toString());
        repository.saveAll(catalogue);
    }

    private Comparator<ItemsDTO> getComparatorForSort(int value) {
        switch (value) {
            case 1: return Comparator.comparingLong(ItemsDTO::getId);
            case 2: return Comparator.comparing(ItemsDTO::getCategory, Comparator.nullsLast(String::compareTo));
            case 3: return Comparator.comparing(ItemsDTO::getName, Comparator.nullsLast(String::compareTo));
            case 4: return Comparator.comparingDouble(ItemsDTO::getPrice);
            case 5: return Comparator.comparingInt(ItemsDTO::getStock);
            case 6: return Comparator.comparing(ItemsDTO::getExpirationDate, Comparator.nullsLast(String::compareTo));
            default: return null;
        }
    }
}
