import { useCatalogue } from "../hooks/useCatalogue"

const MetricsTable: React.FC = () => {
    const { metrics } = useCatalogue();

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
                                    <td>{metric.totalValue.toFixed(2)}</td>
                                    <td>{metric.averageValue.toFixed(2)}</td>
                                </tr>
                        ))}
                    </tbody>
                </table>
            </div>
    </>);
}
export default MetricsTable;