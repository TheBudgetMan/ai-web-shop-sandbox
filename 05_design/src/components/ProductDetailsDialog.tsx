import { Modal } from './Modal';
import { ProductsContainer } from '../store/products';

export function ProductDetailsDialog() {
  const { dialogType, selectedProduct, closeDialog } = ProductsContainer.useContainer();

  const isOpen = dialogType === 'view';

  if (!selectedProduct) return null;

  return (
    <Modal isOpen={isOpen} onClose={closeDialog} title="Product Details" size="md">
      <div className="p-6">
        {/* Product Information */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Product Name
            </label>
            <p className="mt-1 text-lg font-semibold text-gray-900">{selectedProduct.name}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Description
            </label>
            <p className="mt-1 text-gray-700 leading-relaxed">{selectedProduct.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                Price
              </label>
              <p className="mt-1 text-2xl font-bold text-green-600">
                ${selectedProduct.price.toFixed(2)}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </label>
              <p className="mt-1 text-lg font-semibold">
                <span className={`${selectedProduct.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedProduct.stock} units
                </span>
              </p>
            </div>
          </div>

        </div>

        {/* Actions */}
        <div className="flex justify-end mt-6">
          <button
            onClick={closeDialog}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
