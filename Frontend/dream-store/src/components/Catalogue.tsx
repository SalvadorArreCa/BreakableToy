import React, {useState, useEffect }from "react"
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

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
    const [addModal, setAddModal] = useState(false);
    const [modalMode, setModalMode] = useState(false);
    const [newCategory, setNewCategory] = useState(false);
    const [categories, setCategories] = useState<String[]>([]);
    const defaultValue = {
        id: 0,
        category: "",
        name: "",
        price: 0.0,
        stock: 0,
        expirationDate: "",
        creationDate: "",
        updateDate: ""
    }
    const [productData, setProductData] = useState<Items>(defaultValue);
    

    useEffect(() => {
        const getCatalogue = async () => {
            try {
                const catalogue = await fetch("http://localhost:9090/products");
                const categories = await fetch("http://localhost:9090/categories");
                
                if(!catalogue.ok) throw new Error(`We couldn't fetch the catalogue TTATT: ${catalogue.status}`); 
                if(!categories.ok) throw new Error(`Error fetching the categories: ${categories.status}`);

                const catalogueData = await catalogue.json();
                const categoriesData = await categories.json();

                setItems(catalogueData);
                setCategories(categoriesData);
            } catch (error) {
                console.error("The data wasn't fetched: ", error);
                return [];
            }
        };
        getCatalogue();
    },[items,categories]);

    const addProduct = async () => {
        if(productData.id === 0){
            productData.id = (items[items.length - 1].id + 1);
        }

        productData.creationDate = getCurrentDate();
        productData.updateDate = getCurrentDate();

        console.table(productData);

        try {
            const response = await fetch("http://localhost:9090/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(productData)
            });

            if(!response.ok){
                throw new Error(`Error: ${response.status}`);
            }

            setAddModal(false);
            setNewCategory(false);

            const data = await response.json();
            console.log("Server Response: ", data);
        } catch (error) {
            console.error("Error: ", error);
        }
        setProductData(defaultValue);
    }

    const getCurrentDate = (): String => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2,'0');
        const day = String(today.getDate()).padStart(2,'0');

        return `${year}-${month}-${day}`
    }

    const editProduct = async () => {
        productData.updateDate = getCurrentDate();

        try{
            const response = await fetch(`http://localhost:9090/products/${productData.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(productData)
            });

            if(!response.ok) throw new Error(`Error while fetching: ${response.status}`);

            setAddModal(false);
            setNewCategory(false);

            const data = await response.json();
            console.log("Server Response: ", data);
        } catch(error) {
            console.error("Error: ", error);
        }

        setProductData(defaultValue);
    }

    const setOutOfStock = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:9090/products/${id}/out-of-stock`,{
                method:"PUT",
                headers: { "Content-Type": "application/json" },
            })

            if(!response.ok) throw new Error(`Error while fetching: ${response.status}`);

            const data = await response.json();
            console.log("Server Response: ", data);
        } catch (error) {
            console.error("Error: ", error)
        }
        setProductData(defaultValue);
    }

    const deleteProduct = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:9090/delete/${id}`,{
                method:"DELETE",
                headers: {"Content-Type": "application/json"},
            });

            if(!response.ok) throw new Error("Couldn't DELETE the product");

            const data = response.json();
            console.log("Server Response: ", data)
        } catch (error) {
            console.error("Error: ", error);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProductData({...productData, [name]: value, });

    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProductData({...productData, [name]: value});
    }

    return(
        <>
        <div className="flex flex-col bg-neutral-700 h-full px-50 py-10">
            <p className="text-6xl font-bold text-slate-200 text-center">Catalogo</p>
            
            {/* FILTROS DE BUSQUEDA */}
            
            <div className="flex flex-row bg-neutral-500 rounded-xl">
                <div className="flex flex-col p-4 basis-1/2">
                    <Form.Group className="flex flex-row items-center justify-center p-2">
                        <Form.Label className="mx-3">Name</Form.Label>
                        <Form.Control type="text" id="input-name-search"/>
                    </Form.Group>
                    <Form.Group className="flex flex-row items-center p-2">
                        <Form.Label className="mx-3">Category</Form.Label>
                        <Form.Select aria-label="Default select example">
                            <option>Select a category</option>
                            {categories.map((category) => (
                                <option key={String(category)} value={String(category)}>{category}</option>
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
                        <Button type="submit" className="mx-4" variant="primary">Search</Button>
                    </Form.Group>
                </div>
                <div className="bg-red-300 basis-1/2"></div>
            </div>
            <div className="content-start">
                <Button className="m-4" variant="primary" onClick={() => {
                    setProductData(defaultValue);
                    setAddModal(true);
                    setModalMode(true);
                }}>Agregar Producto</Button>
                
                {/* AGREGAR PRODUCTO */}

                <Modal
                    size="lg"
                    show={addModal}
                    onHide={() => {setAddModal(false)}}
                    aria-labelledby="add-product"
                >
                    <Modal.Header closeButton className="bg-neutral-900">
                            <Modal.Title id="add-product">Add Product</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="bg-neutral-800">
                        <Form.Group>
                            <Form.Label className="text-slate-200">Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                id="input-name-add" 
                                name="name"
                                value={String(productData.name)}
                                onChange={handleChange}
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className="text-slate-200">Category</Form.Label>
                            {newCategory ? (
                                <Form.Control 
                                    type="text"
                                    id="input-category-add"
                                    name="category"
                                    value={String(productData.category)}
                                    onChange={handleChange}
                                ></Form.Control>
                            ) : (
                                <Form.Select aria-label="Default select example" name="category" onChange={handleSelectChange}>
                                    <option>Select a category</option>
                                    {categories.map((category) => (
                                        <option key={String(category)} value={String(category)}>{category}</option>
                                    ))}
                                </Form.Select>
                            )}
                            <Button variant="outline-secondary" onClick={() => {
                                if(!newCategory) setNewCategory(true);
                                else setNewCategory(false);
                            }}> + </Button>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className="text-slate-200">Price</Form.Label>
                            <Form.Control 
                                type="text"
                                id="input-price-add"
                                name="price"
                                value={productData.price}
                                onChange={handleChange}
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className="text-slate-200">Stock</Form.Label>
                            <Form.Control 
                                type="text"
                                id="input-stock-add"
                                name="stock"
                                value={Number(productData.stock)}
                                onChange={handleChange}
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className="text-slate-200">Expiration Date</Form.Label>
                            <Form.Control 
                                type="text"
                                id="input-exDate-add"   
                                name="expirationDate"
                                value={String(productData.expirationDate)}
                                onChange={handleChange}
                            ></Form.Control>
                        </Form.Group>
                        <div>
                            {modalMode ? (
                                <Button type="submit" variant="primary" onClick={() => {addProduct()}}>Add</Button>
                            ) : (
                                <Button type="submit" variant="primary" onClick={() => {editProduct()}}>Edit</Button>
                            )}
                            <Button variant="danger" onClick={() => setAddModal(false)}>Cancel</Button>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>

            {/* TABLA DE PRODUCTOS */}

            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th></th>
                        <th>Id</th>
                        <th>Categoria</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Fecha de Caducidad</th>
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
                            <td>{item?.price}</td>
                            <td>{item?.stock}</td>
                            <td>{item?.expirationDate}</td>
                            <td className="text-center">
                                <Button variant="primary" size="sm" onClick={() => {
                                    setProductData(item);
                                    setAddModal(true);
                                    setModalMode(false);
                                }}>Edit</Button>
                            </td>
                            <td className="text-center">
                                <Button variant="danger" size="sm" onClick={() => deleteProduct(item.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <div className="text-center">
                <Button variant="dark">1</Button>
            </div>

            {/* Metricas */}
        </div>
        </>
    );
};

export default Catalogue;