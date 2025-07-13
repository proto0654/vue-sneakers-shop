<script setup>
  const emit = defineEmits(['cartOpen'])
  const props = defineProps({
    totalPrice: {
      type: Number,
      default: 0,
    },
  })
  const handleCartOpen = () => {
    emit('cartOpen')
  }
</script>

<template>
  <div
    class="header-cart cursor-pointer flex-nowrap"
    @click="handleCartOpen"
  >
    <div class="header-cart-icon">
      <img
        src="/cart.svg"
        alt="cart"
      />
    </div>
    <div class="header-cart-total-price">
      <span>{{ totalPrice > 0 ? totalPrice + ' руб' : 'Корзина пуста' }}</span>
    </div>
  </div>
</template>

<style scoped></style>
