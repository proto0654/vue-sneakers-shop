<script setup>
  import { ref, onMounted, watch, computed, inject, reactive } from 'vue'
  import axios from 'axios'
  import ProductsGrid from '../components/products/ProductsGrid.vue'

  const {
    cartItems,
    totalPrice,
    addToCart,
    removeFromCart,
    cartOpen,
    fetchCart,
  } = inject('cartStore', {
    cartItems: ref([]),
    totalPrice: computed(() => 0),
    addToCart: () => {},
    removeFromCart: () => {},
    cartOpen: () => {},
    fetchCart: () => {},
  })

  const products = ref([])
  const filters = reactive({
    sortBy: 'title',
    searchQuery: '',
  })

  const fetchProducts = async () => {
    try {
      const params = {
        sortBy: filters.sortBy,
      }
      if (filters.searchQuery) {
        params.title = `*${filters.searchQuery}*`
      }
      const { data } = await axios.get(
        'https://02633170fd93f889.mokky.dev/sneakers',
        {
          params,
        }
      )
      products.value = data.map((item) => ({
        ...item,
        isFavorite: false,
        isInCart: cartItems.value.some(
          (cartItem) => cartItem.parentId === item.id
        ),
        cartQuantity:
          cartItems.value.find((cartItem) => cartItem.parentId === item.id)
            ?.quantity || 0,
      }))
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const fetchFavorites = async () => {
    try {
      const { data: favorites } = await axios.get(
        'https://02633170fd93f889.mokky.dev/favorites'
      )
      products.value = products.value.map((item) => {
        const isFavorite = favorites.find(
          (favorite) => favorite.parentId === item.id
        )
        if (!isFavorite) {
          return item
        }
        return {
          ...item,
          isFavorite: true,
          isFavoriteId: isFavorite.id,
        }
      })
    } catch (error) {
      console.error('Error fetching favorites:', error)
    }
  }

  const addToFavorites = async (productId) => {
    try {
      const product = products.value.find((p) => p.id === productId)

      if (product.isFavorite) {
        // 1. Сначала API запрос
        await axios.delete(
          `https://02633170fd93f889.mokky.dev/favorites/${product.isFavoriteId}`
        )
        // 2. Потом изменение UI
        product.isFavorite = false
        product.isFavoriteId = null
      } else {
        // 1. Сначала API запрос
        const { data } = await axios.post(
          'https://02633170fd93f889.mokky.dev/favorites',
          { parentId: productId }
        )
        // 2. Потом изменение UI
        product.isFavorite = true
        product.isFavoriteId = data.id
      }
    } catch (error) {
      // UI не изменится, если API упал
      console.error('Error updating favorites:', error)
    }
  }

  onMounted(async () => {
    await fetchCart()
    await fetchProducts()
    await fetchFavorites()
  })

  watch(filters, fetchProducts)

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

  const onSortByChange = (event) => {
    filters.sortBy = event.target.value
  }
  const onSearchQueryChange = (event) => {
    filters.searchQuery = event.target.value
  }
</script>

<template>
  <main class="bg-white rounded-lg w-full p-7 h-none max-w-7xl mx-auto">
    <div
      class="flex flex-col md:flex-row gap-5 justify-between md:items-center my-10"
    >
      <h1
        class="uppercase font-bold text-lg md:text-3xl xl:text-4xl text-center md:text-left text-slate-700"
      >
        Новая партия подкрадуль и&nbsp;бархатных тяг!
      </h1>
      <div class="relative">
        <input
          type="text"
          class="w-full focus:outline-none focus:ring-1 focus:ring-gray-300 border-2 border-slate-300 rounded-md p-2"
          placeholder="Поиск..."
          @input="onSearchQueryChange"
        />
        <div class="absolute right-2 top-1/2 -translate-y-1/2">
          <img
            src="/search.svg"
            alt="search"
            class="w-5 h-5"
          />
        </div>
      </div>
      <select
        class="focus:outline-none focus:ring-1 focus:ring-gray-300 border-2 border-slate-300 rounded-md p-2"
        @change="onSortByChange"
      >
        <option value="price">По возрастанию цены</option>
        <option value="-price">По убыванию цены</option>
        <option value="title">По имени</option>
      </select>
    </div>
    <ProductsGrid
      :products="products"
      @add-to-favorites="addToFavorites"
      @add-to-cart="addToCart"
      @cartOpen="cartOpen"
    />
  </main>
</template>

<style scoped></style>
