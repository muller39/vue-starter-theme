<template>
  <div class="w-full max-w-7xl mx-auto">
    <VcBreadcrumbs :items="breadcrumbs"></VcBreadcrumbs>
    <h1 class="font-bold text-gray-900 text-4xl mt-5 mb-10">Gaming laptop market overview</h1>
  </div>

  <div class="bg-gray-100 py-24">
    <div class="w-full max-w-7xl mx-auto">
      <div class="flex items-center justify-between">
        <div class="">Left</div>
        <div class="">Right</div>
      </div>
    </div>
  </div>

  <div class="h-56">...</div>
  <div class="bg-gray-100 h-56">...</div>
  <div class="bg-gray-700 h-56">...</div>

  <div class="bg-gray-100">
    <div class="w-full max-w-7xl mx-auto py-9 px-5">
      <h2 class="text-center font-bold text-2xl lg:text-4xl mb-2 lg:mb-4">Game laptops</h2>
      <div class="text-center lg:text-lg">
        With a crystal-clear camera, real-time HD video display, and intuitive flight controls, what will you create?
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-4 mt-12">
        <ProductCardGrid v-for="item in products" :key="item.id" :product="item">
          <template #cart-handler>
            <VcButton v-if="item.variations?.length" :to="`/product/${item.id}`" class="uppercase mb-4">
              Choose
            </VcButton>
            <AddToCart v-else :product="item"></AddToCart>
          </template>
        </ProductCardGrid>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IBreadcrumbs, VcBreadcrumbs, VcButton } from "@/components";
import { onMounted, ref } from "vue";
import { ProductCardGrid, useProducts } from "@/shared/catalog";
import { AddToCart } from "@/shared/cart";

const { products, fetchProducts } = useProducts();

onMounted(async () => {
  await fetchProducts({
    itemsPerPage: 8,
    filter: '"BRAND":"HP"',
  });
});

const breadcrumbs = ref<IBreadcrumbs[]>([
  { title: "Home", url: "/" },
  { title: "Landing", url: "/landing" },
]);
</script>
