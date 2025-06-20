import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
//import { CatalogueProvider } from "../context/CatalogueContext";
import ProductsTable from "../components/ProductsTable";
import { CatalogueContext } from "../context/CatalogueContext";

test("renders ProductsTable without crashing", () => {

  const info = {
    items: [], 
    catalogueSize: 1, 
    invert: false,
    setPage: () => 0, 
    setSort: () => 0,
    setInvert: () => false,
    setFilterName: () => null,
    setFilterCategory: () => null,
    setFilterStock: () => 2
  }

  render(
      <CatalogueContext.Provider value = {info}>
          <ProductsTable />
      </CatalogueContext.Provider>
    )
  expect(screen.getByText("Categoria")).toBeInTheDocument();
});
