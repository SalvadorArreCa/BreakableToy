import type { Items } from '../types'
import type { Metrics } from "../types"

interface CatalogueResponse {
    items: Items[];
    catalogueSize: number;
}

//const [productData, setProductData] = useState<Items>(defaultValue);

export const getCatalogue = async (
        page: number, 
        sort: number, 
        invert: boolean,
        filterName: String,
        filterCategory: String[], 
        filterStock: number
    ): Promise<CatalogueResponse | null> => {
    try {
        const queryCategory = filterCategory?.map(c => `category=${encodeURIComponent(String(c))}`).join("&");

        const catalogue = await fetch(`http://localhost:9090/products?page=${page}&sort=${sort}&invert=${invert}&name=${filterName}&stock=${filterStock}&${queryCategory}`);
        const catalogueSize = await fetch("http://localhost:9090/catalogueSize");
                
        if(!catalogue.ok) throw new Error(`We couldn't fetch the catalogue TTATT: ${catalogue.status}`); 
        if(!catalogueSize.ok) throw new Error(`Error fetching size: ${catalogueSize.status}`)

        const catalogueData = await catalogue.json();
        const catalogueSizeData = await catalogueSize.json();

        return { items: catalogueData, catalogueSize: catalogueSizeData};
    } catch (error) {
        console.error("The data wasn't fetched: ", error);
        return null;
    }
};

export const getMetrics = async (): Promise<Metrics[] | null> => {
    try {
        const metrics = await fetch("http://localhost:9090/categories");
        if(!metrics.ok) throw new Error(`Error fetching the categories: ${metrics.status}`);
        const metricsData = await metrics.json();

        return metricsData;
    } catch (error) {
        console.error("The Metrics weren't fetched: ", error);
        return null;
    }
}

export const setProductOutOfStock = async (id: number): Promise<void> => {
        try {
            const response = await fetch(`http://localhost:9090/products/${id}/out-of-stock`,{
                method:"PUT",
                headers: { "Content-Type": "application/json" },
            })

            if(!response.ok) throw new Error(`Error while fetching: ${response.status}`);

            const data = await response.json();
            console.log("Server Response: ", data);
        } catch (error) {
            console.error("Error: ", error)
        }
}