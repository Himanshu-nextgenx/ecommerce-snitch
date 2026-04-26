
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
export const getAllProducts = async () => {
  const response = await productApiInstance.get("/");
  return response.data;
}

export const getProductById = async (id) => {
  const response = await productApiInstance.get(`/${id}`);
  return response.data;
}

export const addProductVariant = async (productId, newProductVariant) => {
  const formData = new FormData();

  newProductVariant.images.forEach((image) => {
    formData.append("variantImages", image.file);
  });

  formData.append("stock", newProductVariant.stock);
  formData.append("priceAmount", newProductVariant.price);
  formData.append("sizes", JSON.stringify(newProductVariant.sizes));
  formData.append("attributes", JSON.stringify(newProductVariant.attributes));

  const response = await productApiInstance.post(`/${productId}/variants`, formData);
  return response.data;
};
