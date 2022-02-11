<template>
  <div class="relative">
    <div class="px-12 py-7 flex items-center justify-between bg-primary">
      <div class="w-full flex items-center space-x-8">
        <BottomHeaderLink v-for="(item, i) in catalogMenu" :key="i" :children="item.children" :title="item.title" />

        <div class="flex-grow">Search</div>

        <BottomHeaderLink v-for="(item, i) in remainingMenu" :key="i" :to="item.url" :title="item.title">
          <template v-if="item.id === 'checkout'">
            <div class="flex items-center">
              <i class="fas fa-shopping-cart text-yellow-500 mr-3"></i>
              <div>{{ item.title }}</div>
              <div
                v-if="cart?.itemsQuantity"
                class="flex items-center rounded-xl border border-yellow-500 px-2 font-bold text-xs h-5 ml-3"
              >
                {{ cart.itemsQuantity }}
              </div>
            </div>
          </template>
        </BottomHeaderLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BottomHeaderLink from "./bottom-header-link.vue";
import menuSchema from "@/config/menu.json";
import { useCart } from "@/shared/cart";

const { cart } = useCart();

const catalogMenu = menuSchema?.header?.catalog;
const remainingMenu = menuSchema?.header?.remaining;
</script>
