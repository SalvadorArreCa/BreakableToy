import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import ProductsTable from "../components/ProductsTable";
import { CatalogueContext } from "../context/CatalogueContext";

// 👇 Mock de getCatalogue
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
      catalogueSize: 2
    })
  )
}));

test("renders ProductsTable without crashing", () => {
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
    catalogueSize: 2,
    invert: false,
    setPage: jest.fn(),
    setSort: jest.fn(),
    setInvert: jest.fn(),
    setFilterName: jest.fn(),
    setFilterCategory: jest.fn(),
    setFilterStock: jest.fn()
  };

  render(
    <CatalogueContext.Provider value={contextMock}>
      <ProductsTable />
    </CatalogueContext.Provider>
  );

  // ✅ Afirmaciones básicas
  expect(screen.getByText("Categoria")).toBeInTheDocument();
  expect(screen.getByText("Papas")).toBeInTheDocument();
  expect(screen.getByText("Agua")).toBeInTheDocument();
});
