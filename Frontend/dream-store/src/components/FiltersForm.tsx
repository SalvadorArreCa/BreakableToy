import { useCatalogue } from "../hooks/useCatalogue";
import { useState } from "react";

const FilterForm: React.FC = () => {

    const { 
        metrics,
        filterName, 
        filterStock, 
        filterCategory, 
        setAddModal,
        setModalMode,
        setFilterName, 
        setFilterCategory, 
        setFilterStock,
        setProductData
    } = useCatalogue();

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

    const checkFilterCategory = (category: string) =>{
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

    return(<>
        <div className="flex flex-row bg-neutral-500 rounded-xl p-6 gap-6">
            <div className="flex flex-col gap-4 basis-1/2">
                <div className="flex items-center gap-4">
                <label className="w-28 text-white">Name</label>
                <input
                    type="text"
                    className="input bg-white w-full rounded-md px-3 py-2"
                    id="input-name-search"
                    value={String(filterName)}
                    onChange={(e) => setFilterName(e.target.value)}
                />
                </div>

                <div className="flex items-center gap-4">
                    <label className="w-28 text-white">Category</label>
                    <select
                        aria-label="Category select"
                        className="select bg-white w-full rounded-md px-3 py-2"
                        value={String(gura)}
                        onChange={(e) => setGura(e.target.value)}
                    >
                        <option value="">Select a category</option>
                            {metrics.map((category, index) => (
                        <option key={index} value={String(category.categoryMetrics)}>
                            {category.categoryMetrics}
                        </option>
                    ))}
                    </select>
                    <button
                        className="btn btn-outline"
                        onClick={() => checkFilterCategory(gura)}
                    >
                    +
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <label className="w-28 text-white">Availability</label>
                    <select
                        aria-label="Stock select"
                        className="select bg-white w-full rounded-md px-3 py-2"
                        value={Number(filterStock)}
                        onChange={(e) => setFilterStock(Number(e.target.value))}
                    >
                        <option value={3}>Select a stock</option>
                        <option value={1}>In Stock</option>
                        <option value={0}>Out of Stock</option>
                        <option value={2}>All</option>
                    </select>
                </div>
            </div>

            <div className="basis-1/2 bg-white rounded-md p-4">
                <ul className="space-y-2">
                    {filterCategory.map((category, index) => (
                    <li key={index} className="flex justify-between items-center border-b pb-1">
                        <span>{category}</span>
                        <button
                            className="btn btn-outline btn-error"
                            onClick={() =>
                            setFilterCategory(filterCategory.filter((_, i) => i !== index))
                        }
                    >
                    ✕
                    </button>
                    </li>
                ))}
                </ul>
            </div>
        </div>

        <div className="flex justify-between">
            <button className="btn btn-primary m-4" onClick={() => {
                setProductData(defaultValue);
                setAddModal(true);
                setModalMode(true);
                const modal = document.getElementById('productModal') as HTMLDialogElement;
                if (modal) modal.showModal();
            }}>Agregar Producto</button>
            <button className="btn btn-primary m-4" onClick={() => {resetFilters()}}>Reset Filters</button>
        </div>
    </>);
}
export default FilterForm;