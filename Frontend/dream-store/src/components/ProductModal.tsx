import { useCatalogue } from "../hooks/useCatalogue";
import { useState } from "react";
import { addProduct, editProduct } from "../context/CatalogueContext";

const ProductModal: React.FC = () => {
  const {
    productData,
    metrics,
    modalMode,
    catalogueSize,
    setAddModal,
    setProductData,
    addModal,
    refreshCatalgue
  } = useCatalogue();

  const [newCategory, setNewCategory] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const closeModal = () => {
    setAddModal(false);
    setNewCategory(false);
  };

  if (!addModal) return null; 

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-neutral-800 text-white w-full max-w-xl mx-4 p-6 rounded-lg shadow-lg relative">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          {modalMode ? "Add Product" : "Edit Product"}
        </h2>

        <div className="mb-4">
          <label htmlFor="input-name-add" className="block mb-1 text-sm font-medium">
            Name
          </label>
          <input
            type="text"
            id="input-name-add"
            name="name"
            value={String(productData.name)}
            onChange={handleChange}
            className="w-full p-2 rounded bg-neutral-700 border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Category</label>
          <div className="flex items-center gap-2">
            {newCategory ? (
              <input
                type="text"
                id="input-category-add"
                name="category"
                value={String(productData.category)}
                onChange={handleChange}
                className="flex-grow p-2 rounded bg-neutral-700 border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ) : (
              <select
                name="category"
                onChange={handleSelectChange}
                className="flex-grow p-2 rounded bg-neutral-700 border border-neutral-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select a category</option>
                {metrics.map((category, index) => (
                  <option key={index} value={String(category.categoryMetrics)}>
                    {category.categoryMetrics}
                  </option>
                ))}
              </select>
            )}
            <button
              type="button"
              onClick={() => setNewCategory(!newCategory)}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              +
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="input-price-add" className="block mb-1 text-sm font-medium">
            Price
          </label>
          <input
            type="text"
            id="input-price-add"
            name="price"
            value={productData.price}
            onChange={handleChange}
            className="w-full p-2 rounded bg-neutral-700 border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="input-stock-add" className="block mb-1 text-sm font-medium">
            Stock
          </label>
          <input
            type="text"
            id="input-stock-add"
            name="stock"
            value={Number(productData.stock)}
            onChange={handleChange}
            className="w-full p-2 rounded bg-neutral-700 border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="input-exDate-add" className="block mb-1 text-sm font-medium">
            Expiration Date
          </label>
          <input
            type="date"
            id="input-exDate-add"
            name="expirationDate"
            value={String(productData.expirationDate)}
            onChange={handleChange}
            className="w-full p-2 rounded bg-neutral-700 border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              if (modalMode) {
                addProduct(productData, catalogueSize, setAddModal, setNewCategory, setProductData, refreshCatalgue);
              } else {
                editProduct(productData, setAddModal, setNewCategory, setProductData, refreshCatalgue);
              }
              closeModal();
            }}
            className="btn btn-primary px-4 py-2 hover:bg-green-700 rounded text-white"
          >
            {modalMode ? "Add" : "Edit"}
          </button>
          <button
            onClick={closeModal}
            className="btn btn-danger px-4 py-2 hover:bg-gray-600 rounded text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
