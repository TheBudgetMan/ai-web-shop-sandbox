export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  created_at: string;
  updated_at: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
}

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  product: Product;
  created_at: string;
  updated_at: string;
}

export interface AddToCartRequest {
  product_id: number;
  quantity?: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export type DialogType = 'add' | 'edit' | 'view' | 'delete' | null;
