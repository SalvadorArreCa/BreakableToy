package com.dream.store.controller;


import com.dream.store.dtos.ItemsDTO;
import com.dream.store.dtos.MetricsDTO;
import com.dream.store.dtos.ProductsPageDTO;
import com.dream.store.exceptions.GlobalExceptionHandler;
import com.dream.store.exceptions.ItemNotFoundException;
import com.dream.store.services.InventoryService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.MockMvcAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.Collections;

@WebMvcTest(controllers = ProductController.class)
@Import(GlobalExceptionHandler.class)
@AutoConfigureMockMvc(addFilters = false)
public class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private InventoryService service;

    @Autowired
    private ObjectMapper objectMapper;

    // ✅ POST /products
    @Test
    void addProduct_success() throws Exception {
        ItemsDTO request = new ItemsDTO(0,"Comida","Nuevo",10.0,5,"","","");
        ItemsDTO response = new ItemsDTO(1,"Comida","Nuevo",10.0,5,"","","");

        when(service.addProduct(any())).thenReturn(response);

        mockMvc.perform(post("/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));

        verify(service, times(1)).addProduct(any());
    }

    // ✅ DELETE /products/{id}
    @Test
    void deleteProduct_success() throws Exception {
        mockMvc.perform(delete("/products/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("The product was deleted succesfully"));

        verify(service, times(1)).deleteProduct(1L);
    }

    // ✅ DELETE 404
    @Test
    void deleteProduct_notFound() throws Exception {
        doThrow(new ItemNotFoundException(99L)).when(service).deleteProduct(99L);

        mockMvc.perform(delete("/products/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").exists());

        verify(service, times(1)).deleteProduct(99L);
    }

    // ✅ PUT /products/{id}
    @Test
    void editProduct_success() throws Exception {
        ItemsDTO edited = new ItemsDTO(1,"Comida","Updated",10.0,5,"","","");

        when(service.updateProduct(eq(1L), any())).thenReturn(edited);

        mockMvc.perform(put("/products/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(edited)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated"));

        verify(service, times(1)).updateProduct(eq(1L), any());
    }

    // ✅ PUT /products/{id}/out-of-stock
    @Test
    void outOfStock_success() throws Exception {
        mockMvc.perform(put("/products/1/out-of-stock"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("The item was put out of stock"));

        verify(service, times(1)).setOutOfStock(1L);
    }

    // ✅ PUT /products/{id}/re-stock
    @Test
    void restock_success() throws Exception {
        mockMvc.perform(put("/products/1/re-stock"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("The item was restocked"));

        verify(service, times(1)).restock(1L);
    }

    // ✅ GET /products/categories
    @Test
    void getCategories_success() throws Exception {
        List<MetricsDTO> metrics = Collections.singletonList(new MetricsDTO("Comida", 10, 100.0, 10.0));
        when(service.getCategoriesWithMetrics()).thenReturn(metrics);

        mockMvc.perform(get("/products/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].categoryMetrics").value("Comida"));

        verify(service, times(1)).getCategoriesWithMetrics();
    }
}
