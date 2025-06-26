import { useCatalogue } from "../hooks/useCatalogue"
import { getOverallMetrics } from "../context/CatalogueContext";

const MetricsTable: React.FC = () => {
    const { metrics } = useCatalogue();
    const overrall = getOverallMetrics(metrics);

    return(<>
            <div className="p-4 bg-white rounded-lg shadow-lg">
                <table className="table text-lg">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Total Products in Stock</th>
                            <th>Total Value in Stock</th>
                            <th>Avarage Price in Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        {metrics.map((metric,index) => (
                                <tr key={index}>
                                    <td>{metric.categoryMetrics}</td>
                                    <td>{metric.totalStock}</td>
                                    <td>${metric.totalValue.toFixed(2)}</td>
                                    <td>${metric.averageValue.toFixed(2)}</td>
                                </tr>
                        ))}
                        <tr className="font-bold">
                            <td>{overrall.categoryMetrics}</td>
                            <td>{overrall.totalStock}</td>
                            <td>${overrall.totalValue.toFixed(2)}</td>
                            <td>${overrall.averageValue.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
    </>);
}
export default MetricsTable;