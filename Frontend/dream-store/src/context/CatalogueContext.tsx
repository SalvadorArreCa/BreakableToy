import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Items } from "../types"
import type { Metrics } from "../types"
import { getCatalogue, getMetrics } from "../services/CatalogueManagement";
import { setProductOutOfStock } from "../services/CatalogueManagement";

interface CatalogueContextProps {
    items: Items[];
    catalogueSize: number;
    invert: boolean,
    setPage: (page: number) => void;
    setSort: (sort: number) => void;
    setFilterName: (name: string) => void;
    setFilterCategory: (categories: string[]) => void;
    setFilterStock: (stock: number) => void;
    setInvert: (invert: boolean) => void;
}

interface MetricsContextProps {
    metrics: Metrics[];
}

interface ProviderProps { children: ReactNode }

export const CatalogueContext = createContext<CatalogueContextProps | null>(null);
export const MetricsContext = createContext<MetricsContextProps | null>(null);

export const CatalogueProvider: React.FC<ProviderProps> = ({ children }) => {
    const [items, setItems] = useState<Items[]>([]);
    const [catalogueSize, setCatalogueSize] = useState(0);
    const [page, setPage] = useState(0);
    const [sort, setSort] = useState(1);
    const [invert, setInvert] = useState(false);
    const [filterName, setFilterName] = useState<String>("");
    const [filterCategory, setFilterCategory] = useState<String[]>([]);
    const [filterStock, setFilterStock] = useState<number>(3);
    
    useEffect(() => {
        const fetchData = async () => {
            const data = await getCatalogue(page, sort, invert, filterName, filterCategory, filterStock);

            if(data) {
                setItems(data.items);
                setCatalogueSize(data.catalogueSize);
            }
        }
        fetchData();
    }, [page, sort, invert, filterName, filterCategory, filterStock, catalogueSize]);

    return (
        <CatalogueContext.Provider value ={{ 
            items, 
            catalogueSize, 
            invert,
            setPage, 
            setSort,
            setInvert,
            setFilterName,
            setFilterCategory,
            setFilterStock }}
         >
            { children }
         </CatalogueContext.Provider>
    );
}

export const MetricsProvider: React.FC<ProviderProps> = ({ children }) => {
    const [metrics, setMetrics] = useState<Metrics[]>([]);
    useEffect(() => {
        const fetchMetrics = async () => {
            const data = await getMetrics();
            if(data) setMetrics(data);
        }
        fetchMetrics();
    });
    return(
        <MetricsContext.Provider value = {{metrics}}>
            { children }
        </MetricsContext.Provider>
    );
} 

export const setOutOfStock = async (id: number) => {
    await setProductOutOfStock(id);
}