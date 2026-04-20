
import axios from "axios";

const productApiInstance = axios.create({
  baseURL: "/api/products",
  withCredentials: true,
});


export const createProduct = async (FormData) => {

   const createProduct = await productApiInstance.post("/", FormData) 
   
   return createProduct.data
   
}
 export const getSellerProducts = async () => {
  const response = await productApiInstance.get("/seller");
  return response.data;
}