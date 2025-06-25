package com.dream.store.entity;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class Metrics {
    private String category;
    private int totalStock;
    private double totalValue;
    private double averageValue;

    public Metrics(String category, int totalStock, double totalValue, double averageValue){
        this.category = category;
        this.totalStock = totalStock;
        this.totalValue = totalValue;
        this.averageValue = averageValue;
    }

    public String getCategoryMetrics() {return category;}
    public int getTotalStock() {return totalStock;}
    public double getTotalValue() {return totalValue;}
    public double getAverageValue() {return averageValue;}

    public void setCategoryMetrics(String category) {this.category = category;}
    public void setTotalStock(int totalStock) {this.totalStock = totalStock;}
    public void setAverageValue(double averageValue){this.averageValue = averageValue;}
    public void setTotalValue(double totalValue){this.totalValue = totalValue;}
 }
