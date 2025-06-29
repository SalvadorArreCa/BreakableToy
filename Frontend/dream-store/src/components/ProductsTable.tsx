import { useCatalogue  } from '../hooks/useCatalogue'
import { setOutOfStock, setReStock, deleteProduct, getDayDifference } from '../context/CatalogueContext';

const ProductsTable: React.FC = () => {

    const { items, catalogueSize, invert, setPage, setSort, setInvert, setProductData, setAddModal, setModalMode, refreshCatalgue} = useCatalogue();
    const invertOrder = (value: number) => {
        setSort(value);
        if(invert) setInvert(false);
        else setInvert(true);     
    }

    //console.log("Items length:", items.length, "Filtered by:", filterName, filterCategory, filterStock);

    return (
        <>
        {/* TABLA DE PRODUCTOS */}
            <table className='w-full table-fix bg-neutral-100 break-words shadow-lg text-center'>
                <thead>
                    <tr className='bg-neutral-400'>
                        <th className="px-6 py-3"></th>
                        <th className="px-6 py-3">Id {<button className="btn btn-outline" onClick={() => invertOrder(1)}> + </button>}</th>
                        <th className="px-6 py-3">Category {<button className="btn btn-outline" onClick={() => invertOrder(2)}> + </button>}</th>
                        <th className="px-6 py-3">Name {<button className="btn btn-outline" onClick={() => invertOrder(3)}> + </button>}</th>
                        <th className="px-6 py-3">Price {<button className="btn btn-outline" onClick={() => invertOrder(4)}> + </button>}</th>
                        <th className="px-6 py-3">Stock {<button className="btn btn-outline" onClick={() => invertOrder(5)}> + </button>}</th>
                        <th className="px-6 py-3">Expiration date {<button className="btn btn-outline" onClick={() => invertOrder(6)}> + </button>}</th>
                        <th className="px-6 py-3"></th>
                        <th className="px-6 py-3"></th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr className={`${getDayDifference(item.expirationDate)}`} key={item.id}>
                            <td className="text-center py-1 px-2 border-1">
                                {item.stock === 0 ? 
                                    <button className="btn btn-warning w-24 h-16" onClick={() => setReStock(item?.id,refreshCatalgue)}> ReStock </button>
                                :
                                    <button className="btn btn-success w-24 h-16" onClick={() => setOutOfStock(item?.id,refreshCatalgue)}> Set Out-of-stock </button>
                                }
                            </td>
                            <td className='px-6 border-1'>{item?.id}</td>
                            <td className='px-6 border-1'>{item?.category}</td>
                            <td className='px-6 border-1'>{item?.name}</td>
                            <td className='px-6 border-1'>${item?.price.toFixed(2)}</td>
                            <td className={`
                                ${item?.stock < 5 ? 'bg-red-400' : item?.stock <= 10 ? 'bg-orange-400' : ''}
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
                                <button className='btn btn-danger' onClick={() => {deleteProduct(item.id, refreshCatalgue)}}>Delete</button>
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