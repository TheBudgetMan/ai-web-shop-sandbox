import type { Product } from '../types/product';
import { ProductsContainer } from '../store/products';
import { Eye, Edit, Trash2 } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { openDialog } = ProductsContainer.useContainer();

  const handleView = () => {
    openDialog('view', product);
  };

  const handleEdit = () => {
    openDialog('edit', product);
  };

  const handleDelete = () => {
    openDialog('delete', product);
  };

  return (
    <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[13px] p-[14px] hover:shadow-sm transition-shadow">
      {/* Product title at top */}
      <h4 className="text-[13.2px] font-normal text-[#0A0A0A] leading-[1.061em] mb-[14px]">
        {product.name}
      </h4>

      {/* Content */}
      <div className="space-y-[14px]">
        {/* Product description */}
        <p className="text-[11.3px] font-normal text-[#717182] leading-[1.549em]">
          {product.description}
        </p>
        
        {/* Price and Stock - Price on left, Stock on right */}
        <div className="flex items-center justify-between">
          <span className="text-[12.8px] font-medium text-[#030213] leading-[1.641em]">${product.price.toFixed(2)}</span>
          <span className="text-[11.3px] font-normal text-[#717182] leading-[1.549em]">Stock: {product.stock}</span>
        </div>
        
        {/* Action buttons at bottom, centered */}
        <div className="flex items-center justify-center gap-[7px]">
          <button
            onClick={handleView}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-[11.3px] font-medium text-[#0A0A0A] bg-white border border-[rgba(0,0,0,0.1)] rounded-[6.75px] hover:bg-gray-50 transition-colors leading-[1.549em]"
          >
            <Eye className="w-[14px] h-[14px]" />
            View
          </button>
          <button
            onClick={handleEdit}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-[11.3px] font-medium text-[#0A0A0A] bg-white border border-[rgba(0,0,0,0.1)] rounded-[6.75px] hover:bg-gray-50 transition-colors leading-[1.549em]"
          >
            <Edit className="w-[14px] h-[14px]" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="inline-flex items-center justify-center p-1.5 text-white bg-[#D4183D] rounded-[6.75px] hover:bg-red-700 transition-colors w-[31.5px] h-[28px]"
          >
            <Trash2 className="w-[14px] h-[14px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
