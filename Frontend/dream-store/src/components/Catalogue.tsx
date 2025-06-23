import {useState, useEffect }from "react"
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';

interface Items {
    id: number;
    category: String;
    name: String;
    price: number;
    stock: number;
    expirationDate: String;
    creationDate: String;
    updateDate: String;
}

interface Metrics {
    categoryMetrics: String;
    totalStock: number;
    totalValue: number;
    averageValue: number;
}

const Catalogue: React.FC = () => {
    const [items, setItems] = useState<Items[]>([]);
    const [metrics, setMetrics] = useState<Metrics[]>([]);
    const [catalogueSize, setCatelogueSize] = useState(0);
    const [page, setPage] = useState(0);
    const [sort, setSort] = useState(1);
    const [addModal, setAddModal] = useState(false);
    const [modalMode, setModalMode] = useState(false);
    const [newCategory, setNewCategory] = useState(false);
    const [invert, setInvert] = useState(false);
    const [filterName, setFilterName] = useState<String>("");
    const [filterCategory, setFilterCategory] = useState<String[]>([]);
    const [filterStock, setFilterStock] = useState<number>(3);
    const [gura, setGura] = useState("");
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
                const queryCategory = filterCategory?.map(c => `category=${encodeURIComponent(String(c))}`).join("&");

                const catalogue = await fetch(`http://localhost:9090/products?page=${page}&sort=${sort}&invert=${invert}&name=${filterName}&stock=${filterStock}&${queryCategory}`);
                const catalogueSize = await fetch("http://localhost:9090/catalogueSize");
                const metrics = await fetch("http://localhost:9090/categories");
                
                if(!catalogue.ok) throw new Error(`We couldn't fetch the catalogue TTATT: ${catalogue.status}`); 
                if(!metrics.ok) throw new Error(`Error fetching the categories: ${metrics.status}`);
                if(!catalogueSize.ok) throw new Error(`Error fetching size: ${catalogueSize.status}`)

                const catalogueData = await catalogue.json();
                const categoriesData = await metrics.json();
                const catalogueSizeData = await catalogueSize.json();

                setItems(catalogueData);
                setMetrics(categoriesData);
                setCatelogueSize(catalogueSizeData.data);
            } catch (error) {
                console.error("The data wasn't fetched: ", error);
                return [];
            }
        };
        getCatalogue();
    },[items,metrics,catalogueSize]);

    const addProduct = async () => {
        if(productData.id === 0){
            productData.id = (catalogueSize + 1);
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

    const invertOrder = (value: number) => {
        setSort(value);
        if(invert) setInvert(false);
        else setInvert(true);     
    }

    const checkFilterCategory = (category: String) =>{
        if(!filterCategory.includes(category))
            setFilterCategory([...filterCategory, category]);
        else
            alert("Categoria ya agregada");

    }

    const resetFilters = () => {
        setGura("");
        setFilterName("");
        setFilterCategory([]);
        setFilterStock(3);
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
                        <Form.Control 
                            type="text" 
                            id="input-name-search"
                            value={String(filterName)}
                            onChange={(e) => setFilterName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="flex flex-row items-center p-2">
                        <Form.Label className="mx-3">Category</Form.Label>
                        <Form.Select 
                            aria-label="Default select example"
                            value={String(gura)}  
                            onChange={(e) => setGura(e.target.value)}
                        >
                            <option value={""}>Select a category</option>
                            {metrics.map((category, index) => (
                                <option key={index} value={String(category.categoryMetrics)}>{category.categoryMetrics}</option>
                            ))}
                        </Form.Select>
                        <Button className="mx-4" variant="primary" onClick={() => {
                                    checkFilterCategory(gura);
                        }}> + </Button>
                    </Form.Group>
                    <Form.Group className="flex flex-row items-center p-2">
                        <Form.Label className="mx-3">Availability</Form.Label>
                        <Form.Select 
                            aria-label="Default select example"
                            value={Number(filterStock)}
                            onChange={(e) => {setFilterStock(Number(e.target.value))}}
                        >
                            <option value={3}>Select a stock</option>
                            <option value={1}>In Stock</option>
                            <option value={0}>Out of Stock</option>
                            <option value={2}>All</option>
                        </Form.Select>
                    </Form.Group>
                </div>
                <div className="basis-1/2">
                        <ListGroup className="p-8">
                            {filterCategory.map((category, index) => (
                                <ListGroup.Item className="d-flex justify-content-between" key={index}>
                                    <span>{category}</span>
                                    <Button variant="outline-secondary" size="sm" onClick={() => {
                                        setFilterCategory(filterCategory.filter((_,i) => i !== index));
                                    }}>X</Button>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                </div>
            </div>
            <div className="flex justify-between">
                <Button className="m-4" variant="primary" onClick={() => {
                    setProductData(defaultValue);
                    setAddModal(true);
                    setModalMode(true);
                }}>Agregar Producto</Button>
                <Button className="m-4" onClick={() => {resetFilters()}}>Reset Filters</Button>
                {/* AGREGAR PRODUCTO */}

                <Modal
                    size="lg"
                    show={addModal}
                    onHide={() => {setAddModal(false)}}
                    aria-labelledby="add-product"
                    className="flex flex-col w-40"
                >
                    <Modal.Header closeButton className="bg-neutral-900 text-slate-200">
                        {modalMode ? (
                            <Modal.Title className="" id="add-product">Add Product</Modal.Title>
                        ) : (
                            <Modal.Title className="" id="add-product">Edit Product</Modal.Title>
                        )}  
                    </Modal.Header>
                    <Modal.Body className="bg-neutral-800">
                        <Form.Group className="flex flex-wrap mx-16 my-2">
                            <Form.Label className="text-slate-200">Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                id="input-name-add" 
                                name="name"
                                value={String(productData.name)}
                                onChange={handleChange}
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group className="mx-16 my-2">
                            <Form.Label className="text-slate-200">Category</Form.Label>
                            <div className="flex flex-row item-center">
                                {newCategory ? (
                                    <Form.Control 
                                        type="text"
                                        id="input-category-add"
                                        name="category"
                                        value={String(productData.category)}
                                        onChange={handleChange}
                                    ></Form.Control>
                                ) : (
                                    <Form.Select 
                                        aria-label="Default select example" 
                                        name="category" 
                                        onChange={handleSelectChange}
                                        className=""
                                    >
                                        <option>Select a category</option>
                                        {metrics.map((category, index) => (
                                            <option key={index} value={String(category.categoryMetrics)}>{category.categoryMetrics}</option>
                                        ))}
                                    </Form.Select>
                                )}
                                <Button className="mx-4" variant="outline-secondary" onClick={() => {
                                    if(!newCategory) setNewCategory(true);
                                    else setNewCategory(false);
                                }}> + </Button>
                            </div>
                        </Form.Group>
                        <Form.Group className="flex flex-wrap mx-16 my-2">
                            <Form.Label className="text-slate-200">Price</Form.Label>
                            <Form.Control 
                                type="text"
                                id="input-price-add"
                                name="price"
                                value={productData.price}
                                onChange={handleChange}
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group className="flex flex-wrap mx-16 my-2">
                            <Form.Label className="text-slate-200">Stock</Form.Label>
                            <Form.Control 
                                type="text"
                                id="input-stock-add"
                                name="stock"
                                value={Number(productData.stock)}
                                onChange={handleChange}
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group className="flex flex-wrap mx-16 my-2">
                            <Form.Label className="text-slate-200">Expiration Date</Form.Label>
                            <Form.Control 
                                type="date"
                                id="input-exDate-add"   
                                name="expirationDate"
                                value={String(productData.expirationDate)}
                                onChange={handleChange}
                            ></Form.Control>
                        </Form.Group>
                        <div className="mx-16 my-4 text-center">
                            {modalMode ? (
                                <Button 
                                    type="submit" 
                                    variant="primary" 
                                    onClick={() => {addProduct()}}
                                    className="m-2 w-1/7"
                                >Add</Button>
                            ) : (
                                <Button 
                                    type="submit" 
                                    variant="primary" 
                                    onClick={() => {editProduct()}}
                                    className="m-2 w-1/7"
                                >Edit</Button>
                            )}
                            <Button 
                                variant="danger" 
                                onClick={() => setAddModal(false)}
                                className="m-2 w-1/7"
                            >Cancel</Button>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>

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
                {Array.from({length : Math.ceil(catalogueSize/10)}, (_,index) => (
                    <Button 
                        key={index} 
                        onClick={() => { setPage(index); }}
                        className="mx-1"
                    >{index + 1}</Button>
                ))}
            </div>

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
        </div>
        </>
    );
};

export default Catalogue;