import { useCatalogue  } from '../hooks/useCatalogue'
import { setOutOfStock } from '../context/CatalogueContext';
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'

const ProductsTable: React.FC = () => {

    const { items, catalogueSize, invert, setPage, setSort, setInvert} = useCatalogue();
    const invertOrder = (value: number) => {
        setSort(value);
        if(invert) setInvert(false);
        else setInvert(true);     
    }

    return (
        <>
        {/* TABLA DE PRODUCTOS */}

            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th></th>
                        <th>Id {<Button size="sm" variant="outline-secondary" onClick={() => invertOrder(1)}> + </Button>}</th>
                        <th>Categoria {<Button size="sm" variant="outline-secondary" onClick={() => invertOrder(2)}> + </Button>}</th>
                        <th>Nombre {<Button size="sm" variant="outline-secondary" onClick={() => invertOrder(3)}> + </Button>}</th>
                        <th>Precio {<Button size="sm" variant="outline-secondary" onClick={() => invertOrder(4)}> + </Button>}</th>
                        <th>Stock {<Button size="sm" variant="outline-secondary" onClick={() => invertOrder(5)}> + </Button>}</th>
                        <th>Fecha de Caducidad {<Button size="sm" variant="outline-secondary" onClick={() => invertOrder(6)}> + </Button>}</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item.id}>
                            <td className="text-center">
                                <Button variant="outline-secondary" size="sm" onClick={() => setOutOfStock(item?.id)}> X </Button>
                            </td>
                            <td>{item?.id}</td>
                            <td>{item?.category}</td>
                            <td>{item?.name}</td>
                            <td>${item?.price.toFixed(2)}</td>
                            <td className={`
                                ${item?.stock >= 5 && item?.stock <= 10 ? 'bg-orange-500' : '' }
                                ${item?.stock < 5 ? 'bg-red-500' : 'bg-red-500'}
                            `}>{item?.stock}</td>
                            <td className="">{item?.expirationDate}</td>
                            <td className="text-center">
                                <Button variant="primary" size="sm" onClick={() => {
                                    //setProductData(item);
                                    //setAddModal(true);
                                    //setModalMode(false);
                                }}>Edit</Button>
                            </td>
                            <td className="text-center">
                                <Button variant="danger" size="sm" onClick={() => {console.log("No hace nada jsjsjs")}/*</td>deleteProduct(item.id)*/}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <div className="text-center">
                {Array.from({length : Math.ceil(catalogueSize/10)}, (_,index) => (
                    <Button 
                        key={index} 
                        onClick={() => { setPage(index); }}
                        className="mx-1"
                    >{index + 1}</Button>
                ))}
            </div>
        </>
    );
};

export default ProductsTable;