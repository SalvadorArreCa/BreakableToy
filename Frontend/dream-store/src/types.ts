export interface Items {
    id: number;
    category: String;
    name: String;
    price: number;
    stock: number;
    expirationDate: string;
    creationDate: String;
    updateDate: String;
}

export interface Metrics {
    categoryMetrics: String;
    totalStock: number;
    totalValue: number;
    averageValue: number;
}


