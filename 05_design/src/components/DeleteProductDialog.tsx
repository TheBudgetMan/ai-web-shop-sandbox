import { Modal } from './Modal';
import { ProductsContainer } from '../store/products';

export function DeleteProductDialog() {
  const { dialogType, selectedProduct, closeDialog, deleteProduct, loading } = ProductsContainer.useContainer();

  const isOpen = dialogType === 'delete';

  if (!selectedProduct) return null;

  const handleDelete = async () => {
    try {
      await deleteProduct(selectedProduct.id);
    } catch (error) {
      // Error is handled by the store
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={closeDialog} title="Delete Product" size="sm">
      <div className="p-6">
        {/* Content */}
        <div className="text-left">
          <p className="text-sm text-gray-500 mb-6">
            Are you sure you want to delete "{selectedProduct.name}"? This action cannot be undone.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={closeDialog}
            className="px-4 py-2 text-black bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors text-xs font-medium"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
          >
            {loading ? 'Deleting...' : 'Delete Product'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
