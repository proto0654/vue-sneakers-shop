<script setup>
  import { ref, computed, onMounted, provide } from 'vue'
  import axios from 'axios'
  import Header from './components/header/Header.vue'
  import Footer from './components/Footer.vue'
  import Drawer from './components/drawer/Drawer.vue'

  const drawerOpen = ref(false)
  const cartItems = ref([])

  const cartOpen = () => {
    drawerOpen.value = true
  }
  const cartClose = () => {
    drawerOpen.value = false
  }

  const fetchCart = async () => {
    try {
      const { data: cart } = await axios.get(
        'https://02633170fd93f889.mokky.dev/cart'
      )
      const { data: allProducts } = await axios.get(
        'https://02633170fd93f889.mokky.dev/sneakers'
      )
      cartItems.value = cart
        .map((cartItem) => {
          const product = allProducts.find((p) => p.id === cartItem.parentId)
          return product
            ? {
                ...cartItem,
                title: product.title,
                price: product.price,
                imageUrl: product.imageUrl,
              }
            : cartItem
        })
        .filter(Boolean) // Filter out nulls if product not found
    } catch (error) {
      console.error('Ошибка при загрузке корзины:', error)
    }
  }

  const addToCart = async (productId) => {
    try {
      const existing = cartItems.value.find(
        (item) => item.parentId === productId
      )
      if (existing) {
        await axios.patch(
          `https://02633170fd93f889.mokky.dev/cart/${existing.id}`,
          { quantity: existing.quantity + 1 }
        )
      } else {
        await axios.post('https://02633170fd93f889.mokky.dev/cart', {
          parentId: productId,
          quantity: 1,
        })
      }
      await fetchCart()
    } catch (error) {
      console.error('Ошибка при добавлении в корзину:', error)
    }
  }

  const removeFromCart = async (cartItemId) => {
    try {
      await axios.delete(
        `https://02633170fd93f889.mokky.dev/cart/${cartItemId}`
      )
      await fetchCart()
    } catch (error) {
      console.error('Ошибка при удалении из корзины:', error)
    }
  }

  const clearCart = async () => {
    try {
      const ids = cartItems.value.map((item) => item.id)
      console.log('Попытка очистить корзину. Найдено id:', ids)
      const results = await Promise.all(
        ids.map((id) => {
          console.log('Отправляю DELETE для id:', id)
          return axios.delete(`https://02633170fd93f889.mokky.dev/cart/${id}`)
        })
      )
      console.log(
        'Результаты удаления:',
        results.map((r) => r.status)
      )
      await fetchCart()
      console.log('Корзина после fetchCart:', cartItems.value)
    } catch (error) {
      console.error('Ошибка при очистке корзины:', error)
    }
  }

  const totalPrice = computed(() =>
    cartItems.value.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
      0
    )
  )

  onMounted(fetchCart)

  // Provide cart-related state and methods as a single object
  provide('cartStore', {
    cartItems,
    totalPrice,
    addToCart,
    removeFromCart,
    clearCart,
    cartOpen,
    cartClose,
    fetchCart,
  })
</script>

<template>
  <Header
    :totalPrice="totalPrice"
    @cartOpen="cartOpen"
  />
  <router-view />
  <Drawer
    :isOpen="drawerOpen"
    :cartItems="cartItems"
    :totalPrice="totalPrice"
    @remove-from-cart="removeFromCart"
    @cart-close="cartClose"
  />
  <Footer />
</template>

<style scoped></style>
