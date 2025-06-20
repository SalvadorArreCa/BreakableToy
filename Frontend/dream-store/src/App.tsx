import { CatalogueProvider, MetricsProvider } from "./context/CatalogueContext";
import ProductsTable from "./components/ProductsTable";

import './App.css'
import './index.css';
import MetricsTable from "./components/MetricsTable";

//import Catalogue from './components/Catalogue'

function App() {

  return (
    <>
      <CatalogueProvider>
        <ProductsTable />
      </CatalogueProvider>
      
      <MetricsProvider>
        <MetricsTable />
      </MetricsProvider>
    </>
  );
}

export default App
