import { Product } from "@/core/api/graphql/types";
import { ref } from "vue";

export default () => {
  const products = ref<Product[]>([]);
  const loading = ref(false);

  function loadProducts(): void {
    loading.value = true;
    try {
      products.value = [
        { code: "123", id: "1", name: "Techpower Cortex ET-2550", imgSrc: "/static/images/landing/1.jpg" },
        { code: "456", id: "2", name: "Xiaomi Mi Notebook Pro GTX", imgSrc: "/static/images/landing/2.jpg" },
        { code: "789", id: "3", name: "MSI GF63 Thin 9RCX", imgSrc: "/static/images/landing/3.jpg" },
        { code: "111", id: "4", name: '23.8" Acer Veriton Z4860G', imgSrc: "/static/images/landing/4.jpg" },
      ];
    } finally {
      loading.value = false;
    }
  }

  return {
    products,
    loading,
    loadProducts,
  };
};
