import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Items } from "../types"
import type { Metrics } from "../types"
import { addProductService, deleteProductService, editProductService, getCatalogue, getMetrics } from "../services/CatalogueManagement";
import { setProductOutOfStock } from "../services/CatalogueManagement";

interface CatalogueContextProps {
    items: Items[];
    metrics: Metrics[];
    catalogueSize: number;
    invert: boolean;
    page: number;
    sort: number;
    filterName: string;
    filterCategory: string[];
    filterStock: number;
    addModal: boolean;
    modalMode: boolean;
    productData: Items;
    refreshCatalgue: () => void;
    setAddModal: (addModal: boolean) => void;
    setModalMode: (modalMode: boolean) => void;
    setProductData: (productData: Items) => void;
    setPage: (page: number) => void;
    setSort: (sort: number) => void;
    setFilterName: (name: string) => void;
    setFilterCategory: (categories: string[]) => void;
    setFilterStock: (stock: number) => void;
    setInvert: (invert: boolean) => void;
}


interface ProviderProps { children: ReactNode }

export const CatalogueContext = createContext<CatalogueContextProps | null>(null);

export const CatalogueProvider: React.FC<ProviderProps> = ({ children }) => {
   const [items, setItems] = useState<Items[]>([]);
   const [metrics, setMetrics] = useState<Metrics[]>([]);
    const [catalogueSize, setCatalogueSize] = useState(0);
    const [page, setPage] = useState(0);
    const [sort, setSort] = useState(1);
    const [invert, setInvert] = useState(false);
    const [addModal, setAddModal] = useState(false);
    const [modalMode, setModalMode] = useState(false);
    const [filterName, setFilterName] = useState<string>("");
    const [filterCategory, setFilterCategory] = useState<string[]>([]);
    const [filterStock, setFilterStock] = useState<number>(3);

const defaultValue = {
        id: 0,
        category: "",
        name: "",
        price: 0.0,
        stock: 0,
        expirationDate: "",
        creationDate: "",
        updateDate: ""
    }
    const [productData, setProductData] = useState<Items>(defaultValue);  
    
    const refreshCatalgue = async ()  => {
        const data = await getCatalogue(page, sort, invert, filterName, filterCategory, filterStock);
            const metricsData = await getMetrics();
            if(data) {
                setItems(data.items);
                setCatalogueSize(data.catalogueSize);
            }
            if(metricsData) {
                setMetrics(metricsData);
            }
    }

    useEffect(() => {
        const fetchData = async () => {
         refreshCatalgue();   
        }
        fetchData();
    }, [page, sort, invert, filterName, filterCategory, filterStock, catalogueSize]);

    return (
        <CatalogueContext.Provider value ={{ 
            items, 
            metrics,
            catalogueSize, 
            invert,
            page,
            sort,
            filterName,
            filterCategory,
            filterStock,
            addModal,
            modalMode,
            productData,
            refreshCatalgue,
            setAddModal,
            setModalMode,
            setProductData,
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

export const setOutOfStock = async (id: number, refreshCatalgue: () => void) => {
    await setProductOutOfStock(id);
    await refreshCatalgue();
}

export const addProduct = async (
    productData: Items, 
    catalogueSize: number, 
    setAddModal: (addModal: boolean) => void,
    setNewCategory: (newCategory: boolean) => void,
    setProductData: (productData: Items) => void,
    refreshCatalgue: () => void
    ) => {
    await addProductService(productData, catalogueSize, setAddModal, setNewCategory, setProductData);
    await refreshCatalgue();
}

export const editProduct = async (
    productData: Items,
    setAddModal: (addModal: boolean) => void,
    setNewCategory: (newCategory: boolean) => void,
    setProductData: (productData: Items) => void,
    refreshCatalgue: () => void
) =>{
    await editProductService(productData, setAddModal, setNewCategory, setProductData);
    await refreshCatalgue();
}

export const deleteProduct = async (id: number, refreshCatalgue: () => void) => {
    await deleteProductService(id);
    await refreshCatalgue();
}

export const getOverallMetrics = (metrics: Metrics[]): Metrics => {
    const overrall: Metrics = {
        categoryMetrics: "Overall", 
        totalStock: 0,
        totalValue: 0.0,
        averageValue: 0.0}

    for(let ina = 0; ina < metrics.length; ina++){
        overrall.totalStock += metrics[ina].totalStock;
        overrall.totalValue += metrics[ina].totalValue;
        overrall.averageValue += metrics[ina].averageValue;
    }

    return overrall;
}

export const getDayDifference = (date_1: string): string => {
    if(date_1 === "" || date_1 === null){
        return "";
    }
    
    const dateDate_1 = new Date(date_1);
    const today: Date = new Date();

    let timeDifference = Math.abs(dateDate_1.getTime() - today.getTime());
    timeDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    if(timeDifference > 10) return "";
    else if(timeDifference <= 10 && timeDifference >= 5) return 'bg-orange-200';
    else if(timeDifference < 5) return 'bg-red-300';

    return '';
}