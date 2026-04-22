import { setProducts,setSellerProducts } from "../state/product.slice";

import { getSellerProducts, createProduct } from "../services/product.api.js";
import { useDispatch } from "react-redux";
import { useCallback } from "react";

export const useProduct = () => {
  const dispatch = useDispatch();
    const handleGetSellerProducts = useCallback(async () => {       

    const data = await getSellerProducts();

    dispatch(setSellerProducts(data));
  }, [dispatch]);

    const handleCreateProduct = useCallback(async (FormData) => {       
       const data = await createProduct(FormData);

       dispatch(setProducts(data));

  }, [dispatch]);
  return { handleGetSellerProducts, handleCreateProduct };    
}
