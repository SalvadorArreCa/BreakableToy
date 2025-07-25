import { CatalogueProvider } from "./context/CatalogueContext";
import ProductsTable from "./components/ProductsTable";
import ProductModal from "./components/ProductModal";
import FilterForm from "./components/FiltersForm";

import './App.css'
import './index.css';
import MetricsTable from "./components/MetricsTable";

//import Catalogue from './components/Catalogue'

function App() {

  return (
    <>
      <div className="flex flex-col bg-neutral-100 h-full px-50 py-10">
        <p className="text-6xl font-bold text-neutral-700 text-center">Catalogue</p>

        <CatalogueProvider>
            <FilterForm />
            <ProductsTable />
            <MetricsTable />
            <ProductModal />
        </CatalogueProvider>

      </div>
    </>
  );
}

export default App
