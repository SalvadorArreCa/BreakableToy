import { useContext } from 'react'
import { MetricsContext } from '../context/CatalogueContext'

export const useMetrics = () => {
    const context = useContext(MetricsContext);
    if(!context) throw new Error("useContext needs to be used in MetricsProvider");
    return context;
}