<script setup>
  import { ref, defineEmits } from 'vue'
  import { useRouter } from 'vue-router'
  import HeaderCart from './HeaderCart.vue'
  import HeaderFavourites from './HeaderFavourites.vue'
  import HeaderProfile from './HeaderProfile.vue'

  const router = useRouter()
  const emit = defineEmits(['cartOpen'])
  const props = defineProps({
    title: {
      type: String,
      default: 'Vue Sneakers',
    },
    description: {
      type: String,
      default: 'Магазин лучших кроссовок',
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
  })

  const navigateTo = (path) => {
    router.push(path)
  }
</script>
<template>
  <header
    class="flex items-center justify-between md:flex-row flex-col max-w-7xl mx-auto"
  >
    <div
      class="logo-header flex flex-wrap items-center gap-2 my-7 md:my-3 cursor-pointer"
      @click="navigateTo('/')"
    >
      <img
        src="/logo.png"
        alt="logo"
        class="w-20 h-20"
      />
      <div class="flex flex-col">
        <p class="text-2xl font-bold">{{ title }}</p>
        <small class="text-sm">{{ description }}</small>
      </div>
    </div>
    <div
      class="header-buttons mb-7 md:mb-0 flex justify-center flex-wrap gap-2 [&>*]:min-w-30 flex [&>*]:flex [&>*]:flex-nowrap [&>*]:items-center [&>*]:justify-center [&>*]:gap-2 [&_img]:w-5 [&_img]:h-5 gap-5 [&>*]:cursor-pointer [&>*]:text-gray-500 [&>*]:hover:text-black"
    >
      <HeaderCart
        :totalPrice="totalPrice"
        @cartOpen="
          () => {
            emit('cartOpen')
          }
        "
      />
      <div
        @click="navigateTo('/favorites')"
        class="header-favourites"
      >
        <HeaderFavourites />
      </div>
      <div
        @click="navigateTo('/orders')"
        class="header-orders"
      >
        <HeaderProfile />
      </div>
    </div>
  </header>
</template>
