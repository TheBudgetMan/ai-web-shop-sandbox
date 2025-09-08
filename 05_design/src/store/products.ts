import { useState, useCallback } from 'react';
import { createContainer } from 'unstated-next';
import type { Product, CreateProductRequest, UpdateProductRequest, DialogType } from '../types/product';
import { productApi } from '../services/api';

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  selectedProduct: Product | null;
  dialogType: DialogType;
}

function useProductsState() {
  const [state, setState] = useState<ProductState>({
    products: [],
    loading: false,
    error: null,
    selectedProduct: null,
    dialogType: null,
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const setProducts = useCallback((products: Product[]) => {
    setState(prev => ({ ...prev, products }));
  }, []);

  const setSelectedProduct = useCallback((product: Product | null) => {
    setState(prev => ({ ...prev, selectedProduct: product }));
  }, []);

  const setDialogType = useCallback((dialogType: DialogType) => {
    setState(prev => ({ ...prev, dialogType }));
  }, []);

  const openDialog = useCallback((type: DialogType, product?: Product) => {
    setSelectedProduct(product || null);
    setDialogType(type);
  }, [setSelectedProduct, setDialogType]);

  const closeDialog = useCallback(() => {
    setDialogType(null);
    setSelectedProduct(null);
  }, [setDialogType, setSelectedProduct]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const products = await productApi.getProducts();
      setProducts(products);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setProducts]);

  const createProduct = useCallback(async (productData: CreateProductRequest) => {
    setLoading(true);
    setError(null);
    try {
      const newProduct = await productApi.createProduct(productData);
      setState(prev => ({
        ...prev,
        products: [...prev.products, newProduct]
      }));
      closeDialog();
      return newProduct;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create product');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, closeDialog]);

  const updateProduct = useCallback(async (id: number, productData: UpdateProductRequest) => {
    setLoading(true);
    setError(null);
    try {
      const updatedProduct = await productApi.updateProduct(id, productData);
      setState(prev => ({
        ...prev,
        products: prev.products.map(p => p.id === id ? updatedProduct : p)
      }));
      closeDialog();
      return updatedProduct;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update product');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, closeDialog]);

  const deleteProduct = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await productApi.deleteProduct(id);
      setState(prev => ({
        ...prev,
        products: prev.products.filter(p => p.id !== id)
      }));
      closeDialog();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete product');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, closeDialog]);

  return {
    ...state,
    openDialog,
    closeDialog,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}

export const ProductsContainer = createContainer(useProductsState);
