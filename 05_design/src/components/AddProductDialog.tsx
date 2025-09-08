import { useState } from 'react';
import { Modal } from './Modal';
import { ProductsContainer } from '../store/products';
import type { CreateProductRequest } from '../types/product';

export function AddProductDialog() {
  const { dialogType, closeDialog, createProduct, loading } = ProductsContainer.useContainer();
  const [formData, setFormData] = useState<CreateProductRequest>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isOpen = dialogType === 'add';

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      stock: 0,
    });
    setErrors({});
    closeDialog();
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (formData.stock < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await createProduct(formData);
      handleClose();
    } catch (error) {
      // Error is handled by the store
    }
  };

  const handleInputChange = (field: keyof CreateProductRequest) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = field === 'price' || field === 'stock' ? parseFloat(e.target.value) || 0 : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Product" size="md">
      <form onSubmit={handleSubmit} className="p-[22px]">
        <div className="space-y-[18px]">
          {/* Product Name */}
          <div>
            <label htmlFor="name" className="block text-[12px] font-medium text-black mb-[2px]">
              Product Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleInputChange('name')}
              className={`w-full px-[11px] py-[8px] bg-[#F3F3F5] border-0 rounded-[6.75px] focus:outline-none focus:ring-2 focus:ring-blue-500 text-[12px] text-black placeholder-[#999999] ${
                errors.name ? 'ring-2 ring-red-500' : ''
              }`}
              placeholder="Enter product name"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-[12px] font-medium text-black mb-[2px]">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange('description')}
              className={`w-full px-[11px] py-[8px] bg-[#F3F3F5] border-0 rounded-[6.75px] focus:outline-none focus:ring-2 focus:ring-blue-500 text-[12px] text-black placeholder-[#999999] resize-none ${
                errors.description ? 'ring-2 ring-red-500' : ''
              }`}
              placeholder="Enter product description"
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          {/* Price and Stock Row */}
          <div className="grid grid-cols-2 gap-[13px]">
            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-[12px] font-medium text-black mb-[2px]">
                Price ($)
              </label>
              <input
                type="number"
                id="price"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleInputChange('price')}
                className={`w-full px-[11px] py-[8px] bg-[#F3F3F5] border-0 rounded-[6.75px] focus:outline-none focus:ring-2 focus:ring-blue-500 text-[12px] text-black placeholder-[#999999] ${
                  errors.price ? 'ring-2 ring-red-500' : ''
                }`}
                placeholder="0.00"
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>

            {/* Stock */}
            <div>
              <label htmlFor="stock" className="block text-[12px] font-medium text-black mb-[2px]">
                Stock
              </label>
              <input
                type="number"
                id="stock"
                min="0"
                value={formData.stock}
                onChange={handleInputChange('stock')}
                className={`w-full px-[11px] py-[8px] bg-[#F3F3F5] border-0 rounded-[6.75px] focus:outline-none focus:ring-2 focus:ring-blue-500 text-[12px] text-black placeholder-[#999999] ${
                  errors.stock ? 'ring-2 ring-red-500' : ''
                }`}
                placeholder="0"
              />
              {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-[8px] mt-[18px]">
          <button
            type="button"
            onClick={handleClose}
            className="px-[14px] py-[7px] text-black bg-white hover:bg-gray-50 border border-[rgba(0,0,0,0.1)] rounded-[6.75px] transition-colors text-[12px] font-medium"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-[12px] py-[7px] bg-[#030213] hover:bg-gray-800 text-white rounded-[6.75px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-[12px] font-medium"
          >
            {loading ? 'Adding...' : 'Add Product'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
