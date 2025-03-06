import { create } from "zustand"

export const useProductStore = create((set) => ({
  products: [],
  setProducts: (products) => set({ products }),
  createProduct: async (newProduct) => {
    if(!newProduct.name || !newProduct.image || !newProduct.price){
      return {success:false, message:"Please fill in all fields."}
    }
    const res = await fetch("/api/products", {
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body: JSON.stringify(newProduct),
    });
    const data = await res.json();
    set((state) => ({products:[...state.products, data]}))
    return {success: true, message: "Product created successfully"};
  },
  fetchProducts: async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    console.log(data);
    set({ products: data });
  },
  deleteProduct: async (pid) => {
    const res = await fetch(`/api/products/${pid}`, {
      method: "DELETE",
    });
    const data = await res;
    if(!data) return { success: false, message: data.message };

    // update the ui immediately, without needing refresh
    set(state => ({ products: state.products.filter(product => product.id !== pid)}));
    return { success: true, message: data.message };
  },
  updateProduct: async (pid, updatedProduct) => {
    if(!updatedProduct.name || !updatedProduct.image || !updatedProduct.price){
      return {success:false, message:"Please fill in all fields."}
    }
    const res = await fetch(`/api/products/${pid}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProduct),
    });
    const data = await res.json();
    if(!data) return { success: false, message: data.message };

    //update the ui immediately wihtout needing a refresh 
    set((state) => ({
      products: state.products.map((product) => (product.id === pid ? data : product)),
    }));

    return { success: true, message: data.message};
  }
}))