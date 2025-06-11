import React, {useState, useEffect }from "react"
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form';

interface Items {
    id: number;
    category: String;
    name: String;
    price: number;
    stock: number;
    expirationDate?: String;
    creationDate: String;
    updateDate?: String;
}

const Catalogue: React.FC = () => {
    const [items, setItems] = useState<Items[]>([]);

    useEffect(() => {
        const getCatalogue = async () => {
            try {
                const response = await fetch("http://localhost:9090/products");
                if(!response.ok){
                    throw new Error(`We couldn't fetch the catalogue TTATT: ${response.status}`);
                }
                console.table(response);
                const data = await response.json();
                setItems(data);
            } catch (error) {
                console.error("The data wasn't fetched: ", error);
                return [];
            }
        };

        getCatalogue();
    },[]);

    return(
        <>
        <div className="flex flex-col bg-neutral-700 h-full px-50 py-10">
            <p className="text-6xl font-bold text-slate-200 text-center">Catalogo</p>
            <div className="flex flex-row bg-neutral-500 rounded-xl">
                <div className="flex flex-col p-4 basis-1/2">
                    <Form.Group className="flex flex-row items-center justify-center p-2">
                        <Form.Label className="mx-3">Name</Form.Label>
                        <Form.Control type="text" id="input-name "/>
                    </Form.Group>
                    <Form.Group className="flex flex-row items-center p-2">
                        <Form.Label className="mx-3">Category</Form.Label>
                        <Form.Select aria-label="Default select example">
                            <option>Select a category</option>
                            {items.map((item) => (
                                <option value={String(item.category)}>{item.category}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="flex flex-row items-center p-2">
                        <Form.Label className="mx-3">Availability</Form.Label>
                        <Form.Select aria-label="Default select example">
                            <option>Select a stock</option>
                            <option value="1">In Stock</option>
                            <option value="2">Out of Stock</option>
                            <option value="3">All</option>
                        </Form.Select>
                        <Button className="mx-4" variant="primary"> Search</Button>
                    </Form.Group>
                </div>
                <div className="bg-red-300 basis-1/2"></div>
            </div>
            <div className="content-start">
                <Button className="m-4" variant="primary">Agregar Producto</Button>
            </div>
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Categoria</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Fecha de Caducidad</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr>
                            <td>{item?.id}</td>
                            <td>{item?.category}</td>
                            <td>{item?.name}</td>
                            <td>{item?.price}</td>
                            <td>{item?.stock}</td>
                            <td>{item?.expirationDate}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
        </>
    );
};

export default Catalogue;