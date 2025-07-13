<script setup>
  const props = defineProps({
    id: Number,
    imageUrl: String,
    title: String,
    price: Number,
    isFavorite: Boolean,
    isFavoriteId: Number,
    isInCart: Boolean,
    cartQuantity: Number,
    onClickCart: Function,
    onClickFavourite: Function,
  })

  const emit = defineEmits(['cartOpen'])

  const base = import.meta.env.BASE_URL

  const handleAddToFavorites = () => {
    props.onClickFavourite(props.id)
  }
  const handleAddToCart = () => {
    props.onClickCart(props.id)
  }

  const handleCartIndicatorClick = () => {
    emit('cartOpen')
  }
</script>
<template>
  <div
    class="m-1 flex flex-col justify-between hover:shadow-2xl hover:shadow-slate-200 rounded-3xl p-4 sneakers-product-grid-item relative hover:-translate-y-1 transition-all duration-300"
  >
    <div class="favourite-btn absolute top-3 right-4">
      <img
        :src="!isFavorite ? '/like-1.svg' : '/like-2.svg'"
        alt="add to favourites"
        title="Добавить в избранное"
        class="w-10 h-10"
        @click="handleAddToFavorites"
      />
    </div>
    <img
      :src="
        imageUrl.startsWith('http')
          ? imageUrl
          : base + imageUrl.replace(/^\/+/, '')
      "
      alt="sneakers"
      class="w-full aspect-square object-contain"
    />
    <p class="text-xl">{{ title }}</p>
    <div
      class="flex items-center justify-between sneakers-product-grid-item-info mt-5"
    >
      <div class="">
        <p class="text-lg">{{ price }} руб.</p>
        <p
          v-if="isInCart && cartQuantity > 0"
          class="text-green-600 cursor-pointer"
          @click="handleCartIndicatorClick"
        >
          В корзине: {{ cartQuantity }}
        </p>
      </div>
      <img
        :src="!isInCart ? '/plus.svg' : '/checked.svg'"
        alt="add to cart"
        title="Добавить в корзину"
        class="w-10 h-10 cursor-pointer hover:border-2 hover:border-slate-200 rounded-xl"
        @click="handleAddToCart"
      />
    </div>
  </div>
</template>
