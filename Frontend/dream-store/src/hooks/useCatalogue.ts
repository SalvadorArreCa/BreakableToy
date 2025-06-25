import { useContext } from 'react'
import { CatalogueContext } from '../context/CatalogueContext'

export const useCatalogue = () => {
    const context = useContext(CatalogueContext);
    if(!context) throw new Error("useContext debe usarse dentro de un CatalogueProvider");
    return context;
}