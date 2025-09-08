import { ProductsContainer } from './store/products';
import { CartContainer } from './store/cart';
import { ProductGrid } from './components/ProductGrid';
import { AddProductDialog } from './components/AddProductDialog';
import { EditProductDialog } from './components/EditProductDialog';
import { ProductDetailsDialog } from './components/ProductDetailsDialog';
import { DeleteProductDialog } from './components/DeleteProductDialog';
import { Cart } from './components/Cart';
import { Search, Plus } from 'lucide-react';

function AppContent() {
  const { openDialog } = ProductsContainer.useContainer();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Header with Title */}
        <h1 className="text-[13.2px] font-normal text-[#0A0A0A] mb-6 leading-[1.591em]">Product Management</h1>
        
        {/* Search and Add Product Row */}
        <div className="flex items-center gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#000000] w-[14px] h-[14px]" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#F3F3F5] border-0 rounded-[6.75px] focus:outline-none focus:ring-2 focus:ring-blue-500 text-[10.7px] text-[#0A0A0A] leading-[1.374em] placeholder:text-[#0A0A0A]"
            />
          </div>
          
          {/* Add Product Button */}
          <button
            onClick={() => openDialog('add')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#030213] hover:bg-gray-800 text-white font-medium rounded-[6.75px] transition-colors text-[11.3px] leading-[1.549em]"
          >
            <Plus className="w-[14px] h-[14px]" />
            Add Product
          </button>
        </div>

        {/* Product Grid */}
        <ProductGrid />
      </div>

      {/* Dialogs */}
      <AddProductDialog />
      <EditProductDialog />
      <ProductDetailsDialog />
      <DeleteProductDialog />
      
      {/* Cart */}
      <Cart />
    </div>
  );
}

function App() {
  return (
    <ProductsContainer.Provider>
      <CartContainer.Provider>
        <AppContent />
      </CartContainer.Provider>
    </ProductsContainer.Provider>
  );
}

export default App;
