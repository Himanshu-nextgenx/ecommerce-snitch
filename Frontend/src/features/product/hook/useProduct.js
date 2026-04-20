import { setProducts,setSellerProducts } from "../state/product.slice";

import { getSellerProducts, createProduct } from "../services/product.api.js";
import { useDispatch } from "react-redux";

export const useProduct = () => {
  const dispatch = useDispatch();
    const handleGetSellerProducts = async () => {       

    const data = await getSellerProducts();

    dispatch(setSellerProducts(data));
  }

    const handleCreateProduct = async (FormData) => {       
       const data = await createProduct(FormData);

       dispatch(setProducts(data));

  }
  return { handleGetSellerProducts, handleCreateProduct };    
}
