import type { Items } from "../types";
import type { Metrics } from "../types";

interface CatalogueResponse {
  items: Items[];
  catalogueSize: number;
}

const defaultValue = {
  id: 0,
  category: "",
  name: "",
  price: 0.0,
  stock: 0,
  expirationDate: "",
  creationDate: "",
  updateDate: "",
};

export const getCatalogue = async (
  page: number,
  sort: number,
  invert: boolean,
  filterName: String,
  filterCategory: String[],
  filterStock: number
): Promise<CatalogueResponse | null> => {
  try {
    const queryCategory = filterCategory
      ?.map((c) => `category=${encodeURIComponent(String(c))}`)
      .join("&");

    const catalogue = await fetch(
      `http://localhost:9090/products?page=${page}&sort=${sort}&invert=${invert}&name=${filterName}&stock=${filterStock}&${queryCategory}`
    );
    const catalogueSize = await fetch("http://localhost:9090/catalogueSize");

    if (!catalogue.ok)
      throw new Error(
        `We couldn't fetch the catalogue TTATT: ${catalogue.status}`
      );
    if (!catalogueSize.ok)
      throw new Error(`Error fetching size: ${catalogueSize.status}`);

    const catalogueData = await catalogue.json();
    const catalogueSizeData = await catalogueSize.json();

    return { items: catalogueData, catalogueSize: catalogueSizeData.data };
  } catch (error) {
    console.error("The data wasn't fetched: ", error);
    return null;
  }
};

export const getMetrics = async (): Promise<Metrics[] | null> => {
  try {
    const metrics = await fetch("http://localhost:9090/categories");
    if (!metrics.ok)
      throw new Error(`Error fetching the categories: ${metrics.status}`);
    const metricsData = await metrics.json();

    return metricsData;
  } catch (error) {
    console.error("The Metrics weren't fetched: ", error);
    return null;
  }
};

export const setProductOutOfStock = async (id: number): Promise<void> => {
  try {
    const response = await fetch(
      `http://localhost:9090/products/${id}/out-of-stock`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok)
      throw new Error(`Error while fetching: ${response.status}`);

    const data = await response.json();
    console.log("Server Response: ", data);
  } catch (error) {
    console.error("Error: ", error);
  }
};

export const getCurrentDate = (): String => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const addProductService = async (
  productData: Items,
  catalogueSize: number,
  setAddModal: (addModal: boolean) => void,
  setNewCategory: (newCategory: boolean) => void,
  setProductData: (productData: Items) => void,
) => {
  if (productData.id === 0) {
    productData.id = catalogueSize + 1;
  }

  productData.creationDate = getCurrentDate();
  productData.updateDate = getCurrentDate();

  console.table(productData);

  try {
    const response = await fetch("http://localhost:9090/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    setAddModal(false);
    setNewCategory(false);

    const data = await response.json();
    console.log("Server Response: ", data);
  } catch (error) {
    console.error("Error: ", error);
  }
  setProductData(defaultValue);
};

export const editProductService = async (
  productData: Items,
  setAddModal: (addModal: boolean) => void,
  setNewCategory: (newCategory: boolean) => void,
  setProductData: (productData: Items) => void
) => {
  productData.updateDate = getCurrentDate();

  try {
    const response = await fetch(
      `http://localhost:9090/products/${productData.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      }
    );

    if (!response.ok)
      throw new Error(`Error while fetching: ${response.status}`);

    setAddModal(false);
    setNewCategory(false);

    const data = await response.json();
    console.log("Server Response: ", data);
  } catch (error) {
    console.error("Error: ", error);
  }
  setProductData(defaultValue);
};

export const deleteProductService = async (id: number) => {
  try {
    const response = await fetch(`http://localhost:9090/delete/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) throw new Error("Couldn't DELETE the product");

    const data = response.json();
    console.log("Server Response: ", data);
  } catch (error) {
    console.error("Error: ", error);
  }
};
