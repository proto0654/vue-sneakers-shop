<script setup>
  import { computed } from 'vue'
  import DrawerHeader from './DrawerHeader.vue'
  import DrawerBody from './DrawerBody.vue'
  import DrawerFooter from './DrawerFooter.vue'

  const props = defineProps({
    cartItems: {
      type: Array,
      required: true,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
  })

  const emit = defineEmits(['removeFromCart', 'cartClose'])

  const removeFromCart = (cartItemId) => {
    emit('removeFromCart', cartItemId)
  }
</script>

<template>
  <div
    @click="emit('cartClose')"
    class="fixed top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sm transition-opacity duration-300"
    :class="
      isOpen
        ? 'opacity-100 pointer-events-auto'
        : 'opacity-0 pointer-events-none'
    "
  >
    <div
      @click.stop
      class="w-full md:w-1/3 md:min-w-[380px] h-full bg-white md:ml-auto p-5 flex flex-col justify-between min-h-screen transform transition-transform duration-300 ease-out"
      :class="isOpen ? 'translate-x-0' : 'translate-x-full'"
    >
      <div class="overflow-y-auto h-full">
        <DrawerHeader :cartClose="() => emit('cartClose')" />
        <DrawerBody
          :products="cartItems"
          :onRemove="removeFromCart"
        />
      </div>
      <DrawerFooter
        :totalPrice="totalPrice"
        @drawerClose="emit('cartClose')"
      />
    </div>
  </div>
</template>
