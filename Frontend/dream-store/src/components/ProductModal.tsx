import { useCatalogue } from "../hooks/useCatalogue";
import { useState } from "react";
import { addProduct, editProduct } from "../context/CatalogueContext";

const ProductModal: React.FC = () => {
  const {
    productData,
    metrics,
    modalMode,
    setAddModal,
    setProductData,
    addModal,
    refreshCatalgue
  } = useCatalogue();

  const [newCategory, setNewCategory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const validateForm = () => {
  if (!productData.name) return "Name is required";
  if (!productData.category) return "Category is required";

  const price = Number(productData.price);
  if (isNaN(price) || price < 0) return "Price must be a number and cannot be negative";

  const stock = Number(productData.stock);
  if (isNaN(stock) || stock < 0) return "Stock must be a number and cannot be negative";

  if (productData.expirationDate) {
    const today = new Date().toISOString().split("T")[0];
    if (productData.expirationDate < today) {
      return "Expiration date cannot be in the past";
    }
  }

  return null;
};

const handleSubmit = () => {
  const validationError = validateForm();
  if (validationError) {
    alert(validationError); // ✅ Ahora se usan alerts en lugar de mensajes en pantalla
    return;
  }

  if (!productData.expirationDate) {
    productData.expirationDate = "";
  }

  if (modalMode) {
    addProduct(productData, setAddModal, setNewCategory, setProductData, refreshCatalgue);
  } else {
    editProduct(productData, setAddModal, setNewCategory, setProductData, refreshCatalgue);
  }

  closeModal();
};



  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const closeModal = () => {
    setAddModal(false);
    setNewCategory(false);
    setError(null);
  };

  if (!addModal) return null; 

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-neutral-200 text-neutral-800 w-full max-w-xl mx-4 p-6 rounded-lg shadow-lg relative">
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
            className="w-full p-2 rounded bg-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                className="flex-grow p-2 rounded bg-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ) : (
              <select
                name="category"
                onChange={handleSelectChange}
                className="flex-grow p-2 rounded bg-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
              className="btn btn-primary px-3 py-1"
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
            className="w-full p-2 rounded bg-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
            className="w-full p-2 rounded bg-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="input-exDate-add" className="block mb-1 text-sm font-medium">
            Expiration Date
          </label>
          <input
            type="date"
            name="expirationDate"
            value={String(productData.expirationDate)}
            onChange={handleChange}
            className={`w-full p-2 rounded bg-white border ${
              error?.includes("Expiration") ? "border-red-500" : "border-neutral-600"
            } focus:outline-none focus:ring-2 focus:ring-blue-400`}
          />
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={handleSubmit} className="btn btn-primary px-4 py-2">
            {modalMode ? "Add" : "Edit"}
          </button>
          <button onClick={closeModal} className="btn btn-danger px-4 py-2">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
