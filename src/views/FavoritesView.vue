<script setup>
  import { ref, onMounted, computed, inject, watch } from 'vue'
  import axios from 'axios'
  import ProductsGrid from '../components/products/ProductsGrid.vue'
  import { useRouter } from 'vue-router'

  const { cartItems, addToCart, cartOpen, fetchCart } = inject('cartStore', {
    cartItems: ref([]),
    totalPrice: computed(() => 0),
    addToCart: () => {},
    removeFromCart: () => {},
    cartOpen: () => {},
    fetchCart: () => {},
  })

  const router = useRouter()
  const products = ref([])
  const favorites = ref([])

  const fetchFavorites = async () => {
    try {
      const { data: favoritesData } = await axios.get(
        'https://02633170fd93f889.mokky.dev/favorites'
      )
      favorites.value = favoritesData

      const { data: allProducts } = await axios.get(
        'https://02633170fd93f889.mokky.dev/sneakers'
      )

      products.value = allProducts
        .map((item) => {
          const isFavorite = favoritesData.find(
            (favorite) => favorite.parentId === item.id
          )
          if (isFavorite) {
            return {
              ...item,
              isFavorite: true,
              isFavoriteId: isFavorite.id,
              isInCart: cartItems.value.some(
                (cartItem) => cartItem.parentId === item.id
              ),
              cartQuantity:
                cartItems.value.find(
                  (cartItem) => cartItem.parentId === item.id
                )?.quantity || 0,
            }
          }
          return null
        })
        .filter(Boolean)
    } catch (error) {
      console.error('Error fetching favorites:', error)
    }
  }

  onMounted(async () => {
    await fetchCart()
    await fetchFavorites()
  })

  watch(cartItems, () => {
    products.value = products.value.map((item) => ({
      ...item,
      isInCart: cartItems.value.some(
        (cartItem) => cartItem.parentId === item.id
      ),
      cartQuantity:
        cartItems.value.find((cartItem) => cartItem.parentId === item.id)
          ?.quantity || 0,
    }))
  })

  const addToFavorites = async (productId) => {
    try {
      const product = products.value.find((p) => p.id === productId)

      if (product.isFavorite) {
        await axios.delete(
          `https://02633170fd93f889.mokky.dev/favorites/${product.isFavoriteId}`
        )
        products.value = products.value.filter((p) => p.id !== productId)
      } else {
        const { data } = await axios.post(
          'https://02633170fd93f889.mokky.dev/favorites',
          { parentId: productId }
        )
        product.isFavorite = true
        product.isFavoriteId = data.id
      }
    } catch (error) {
      console.error('Error updating favorites:', error)
    }
  }
</script>

<template>
  <main class="bg-white rounded-lg w-full p-7 h-none max-w-7xl mx-auto">
    <div
      class="flex flex-col md:flex-row gap-5 justify-between md:items-center my-10"
    >
      <h1 class="uppercase font-bold text-3xl">Избранные товары</h1>
      <button
        @click="router.push('/')"
        class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
      >
        Вернуться к товарам
      </button>
    </div>

    <div
      v-if="products.length === 0"
      class="text-center py-20"
    >
      <h2 class="text-2xl font-bold text-gray-600 mb-4">Избранное пусто</h2>
      <p class="text-gray-500 mb-6">
        Добавьте товары в избранное, чтобы они появились здесь
      </p>
      <button
        @click="router.push('/')"
        class="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors"
      >
        Перейти к товарам
      </button>
    </div>

    <ProductsGrid
      v-else
      :products="products"
      @add-to-favorites="addToFavorites"
      @add-to-cart="addToCart"
      @cartOpen="cartOpen"
    />
  </main>
</template>

<style scoped></style>
