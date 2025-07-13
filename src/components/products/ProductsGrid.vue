<script setup>
  import ProductCard from './ProductCard.vue'
  defineProps({
    products: {
      type: Array,
      required: true,
    },
  })
  const emit = defineEmits(['addToFavorites', 'addToCart', 'cartOpen'])
</script>
<template>
  <section
    class="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 sneakers-product-grid"
    v-auto-animate
  >
    <ProductCard
      v-for="product in products"
      :key="product.id"
      :title="product.title"
      :price="product.price"
      :imageUrl="product.imageUrl"
      :isFavorite="product.isFavorite"
      :isFavoriteId="product.isFavoriteId"
      :isInCart="product.isInCart"
      :cartQuantity="product.cartQuantity"
      :id="product.id"
      :on-click-favourite="() => emit('addToFavorites', product.id)"
      :on-click-cart="() => emit('addToCart', product.id)"
      @cartOpen="emit('cartOpen')"
    />
  </section>
</template>
