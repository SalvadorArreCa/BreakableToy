package com.dream.store.repositories;

import com.dream.store.dtos.ItemsDTO;
import java.util.List;

public interface ItemsRepository {
    List<ItemsDTO> findAll();
    void saveAll(List<ItemsDTO> items);
}
