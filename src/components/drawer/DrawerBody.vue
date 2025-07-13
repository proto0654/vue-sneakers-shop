<script setup>
  import CartItem from './CartItem.vue'

  const props = defineProps({
    products: {
      type: Array,
      required: true,
    },
    onRemove: {
      type: Function,
      default: () => {},
    },
  })
</script>

<template>
  <div
    class="flex flex-col gap-3"
    v-auto-animate
  >
    <div
      v-if="products.length === 0"
      class="text-center text-gray-500 py-8"
    >
      Корзина пуста
    </div>
    <CartItem
      v-for="product in products"
      :key="product.id"
      :product="product"
      :onRemove="onRemove"
    />
  </div>
</template>
