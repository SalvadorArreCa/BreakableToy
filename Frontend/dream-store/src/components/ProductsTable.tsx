import { useCatalogue  } from '../hooks/useCatalogue'
import { setOutOfStock } from '../context/CatalogueContext';

const ProductsTable: React.FC = () => {

    const { items, catalogueSize, invert, setPage, setSort, setInvert, setProductData, setAddModal, setModalMode} = useCatalogue();
    const invertOrder = (value: number) => {
        setSort(value);
        if(invert) setInvert(false);
        else setInvert(true);     
    }

    //console.log("Items length:", items.length, "Filtered by:", filterName, filterCategory, filterStock);

    return (
        <>
        {/* TABLA DE PRODUCTOS */}
            <table className='w-full bg-white'>
                <thead>
                    <tr className='bg-primary border-1'>
                        <th className="px-6 py-3 border-1"></th>
                        <th className="px-6 py-3 border-1">Id {<button className="btn btn-outline" onClick={() => invertOrder(1)}> + </button>}</th>
                        <th className="px-6 py-3 border-1">Categoria {<button className="btn btn-outline" onClick={() => invertOrder(2)}> + </button>}</th>
                        <th className="px-6 py-3 border-1">Nombre {<button className="btn btn-outline" onClick={() => invertOrder(3)}> + </button>}</th>
                        <th className="px-6 py-3 border-1">Precio {<button className="btn btn-outline" onClick={() => invertOrder(4)}> + </button>}</th>
                        <th className="px-6 py-3 border-1">Stock {<button className="btn btn-outline" onClick={() => invertOrder(5)}> + </button>}</th>
                        <th className="px-6 py-3 border-1">Fecha de Caducidad {<button className="btn btn-outline" onClick={() => invertOrder(6)}> + </button>}</th>
                        <th className="px-6 py-3 border-1"></th>
                        <th className="px-6 py-3 border-1"></th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item.id}>
                            <td className="text-center py-4 px-6 border-1">
                                <button className="btn btn-outline" onClick={() => setOutOfStock(item?.id)}> X </button>
                            </td>
                            <td className='px-6 border-1'>{item?.id}</td>
                            <td className='px-6 border-1'>{item?.category}</td>
                            <td className='px-6 border-1'>{item?.name}</td>
                            <td className='px-6 border-1'>${item?.price.toFixed(2)}</td>
                            <td className={`
                                ${item?.stock < 5 ? 'bg-red-500' : item?.stock <= 10 ? 'bg-orange-500' : ''}
                                px-6 border-1
                            `}>{item?.stock}</td>
                            <td className='px-6 border-1'>{item?.expirationDate}</td>
                            <td className='px-6 border-1'>
                                <button className='btn btn-primary' onClick={() => {
                                    setProductData(item);
                                    setAddModal(true);
                                    setModalMode(false);
                                    const modal = document.getElementById('productModal') as HTMLDialogElement;
                                    console.log(modal);
                                    if (modal) modal.showModal();
                                }}>Edit</button>
                            </td>
                            <td className='py-4 px-6 border-1'>
                                <button className='btn btn-danger' onClick={() => {console.log("No hace nada jsjsjs")}/*</td>deleteProduct(item.id)*/}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="text-center">
                {Array.from({length : Math.ceil(catalogueSize/10)}, (_,index) => (
                    <button 
                        key={index} 
                        onClick={() => { setPage(index); }}
                        className="btn btn-primary mx-1 my-4"
                    >{index + 1}</button>
                ))}
            </div>
        </>
    );
};

export default ProductsTable;