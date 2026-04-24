import { setProducts, setSellerProducts } from "../state/product.slice";

import {
  getSellerProducts,
  createProduct,
  getAllProducts,
  getProductById,
} from "../services/product.api.js";
import { useDispatch } from "react-redux";

// use callback use kr sakte hai for better performance but for now we can keep it simple
// use callback isliye use krte hai taki function reference change na ho aur unnecessary re-rendering na ho
export const useProduct = () => {
  const dispatch = useDispatch();
  const handleGetSellerProducts = async () => {
    const data = await getSellerProducts();

    dispatch(setSellerProducts(data));
  };

  const handleCreateProduct = async (formData) => {
    const data = await createProduct(formData);

    dispatch(setProducts(data));
  };

  const handleGetAllProducts = async () => {
    const data = await getAllProducts();

    dispatch(setProducts(data));
  };

  const handleGetProductById = async (id) => {
    const data = await getProductById(id);

    dispatch(setProducts(data));
  };

  return {
    handleGetSellerProducts,
    handleCreateProduct,
    handleGetAllProducts,
    handleGetProductById,
  };
};
