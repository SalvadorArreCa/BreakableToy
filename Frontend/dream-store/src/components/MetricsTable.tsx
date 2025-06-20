import { useMetrics } from "../hooks/useMetrics"
import Table from 'react-bootstrap/Table'

const MetricsTable: React.FC = () => {
    const { metrics } = useMetrics();

    return(<>
        {/* Metricas */}
            <div className="my-4">
                <Table>
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
                </Table>
            </div>
    </>);
}
export default MetricsTable;