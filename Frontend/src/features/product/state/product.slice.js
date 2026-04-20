import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    sellerProducts: [],
    products: [],
    loading: false,
  },
  reducers: {
    setSellerProducts: (state, action) => {
      state.products = action.payload;
    },
    setProducts: (state, action) => {
      state.products = action.payload;
    },
  },
});

export const { setProducts, setSellerProducts } = productSlice.actions;
export default productSlice.reducer;
