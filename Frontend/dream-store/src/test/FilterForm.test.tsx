import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import FilterForm from "../components/FiltersForm";
import { CatalogueContext } from "../context/CatalogueContext";

jest.mock("../services/CatalogueManagement", () => ({
  getCatalogue: jest.fn(() =>
    Promise.resolve({
      items: [
        {
          id: 1,
          category: "Snacks",
          name: "Papas",
          price: 12.5,
          stock: 8,
          expirationDate: "2026-01-01",
          creationDate: "2024-01-01",
          updateDate: "2024-06-01"
        },
        {
          id: 2,
          category: "Bebidas",
          name: "Agua",
          price: 7.99,
          stock: 20,
          expirationDate: "2025-12-31",
          creationDate: "2024-02-01",
          updateDate: "2024-06-05"
        }
      ],
      metrics: [{
        categoryMetrics: "Snacks",
        totalStock: 8,
        totalValue: 12.5,
        averageValue: 12.5
      },
    {
      categoryMetrics: "Bebidas",
      totalStock: 20,
      totalValue: 7.99,
      averageValue: 7.99
    }
    ],
      catalogueSize: 2
    })
  )
}));

test("renders ProductsTable without crashing", () => {
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
  const contextMock = {
    items: [
      {
        id: 1,
        category: "Snacks",
        name: "Papas",
        price: 12.5,
        stock: 8,
        expirationDate: "2026-01-01",
        creationDate: "2024-01-01",
        updateDate: "2024-06-01"
      },
      {
        id: 2,
        category: "Bebidas",
        name: "Agua",
        price: 7.99,
        stock: 20,
        expirationDate: "2025-12-31",
        creationDate: "2024-02-01",
        updateDate: "2024-06-05"
      }
    ],
    metrics: [{
        categoryMetrics: "Snacks",
        totalStock: 8,
        totalValue: 12.5,
        averageValue: 12.5
      },
    {
      categoryMetrics: "Bebidas",
      totalStock: 20,
      totalValue: 7.99,
      averageValue: 7.99
    }],
    catalogueSize: 2,
    invert: false,
    page: 0,
    sort: 0,
    filterName: "",
    filterCategory: [],
    filterStock: 2,
    addModal: false,
    modalMode: false,
    productData: defaultValue,
    setAddModal: jest.fn(),
    setModalMode: jest.fn(),
    setProductData: jest.fn(),
    setPage: jest.fn(),
    setSort: jest.fn(),
    setInvert: jest.fn(),
    setFilterName: jest.fn(),
    setFilterCategory: jest.fn(),
    setFilterStock: jest.fn()
  };

  render(
    <CatalogueContext.Provider value={contextMock}>
      <FilterForm />
    </CatalogueContext.Provider>
  );

  expect(screen.getByText("Name")).toBeInTheDocument();
  expect(screen.getByText("Category")).toBeInTheDocument();
  expect(screen.getByText("Availability")).toBeInTheDocument();
});