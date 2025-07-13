<script setup>
  import { ref, onMounted, computed, inject, watch } from 'vue'
  import axios from 'axios'
  import { useRouter, useRoute } from 'vue-router'
  import CartItem from '../components/drawer/CartItem.vue'

  const { cartItems, totalPrice, fetchCart, clearCart } = inject('cartStore', {
    cartItems: ref([]),
    totalPrice: computed(() => 0),
    addToCart: () => {},
    removeFromCart: () => {},
    cartOpen: () => {},
    fetchCart: () => {},
    clearCart: () => {},
  })

  const router = useRouter()
  const route = useRoute()
  const order = ref(null)
  const loading = ref(true)

  const base = import.meta.env.BASE_URL

  const fetchOrder = async () => {
    try {
      loading.value = true
      const orderId = route.query.id

      if (!orderId) {
        // Если нет ID заказа, показываем текущую корзину как заказ из глобального состояния
        // items are already enriched in App.vue, so just use cartItems.value
        order.value = {
          id: 'current-cart',
          status: 'pending',
          createdAt: new Date().toISOString(),
          items: cartItems.value,
          totalPrice: totalPrice.value,
        }
      } else {
        const { data: orderData } = await axios.get(
          `https://02633170fd93f889.mokky.dev/orders/${orderId}`
        )
        const { data: allProducts } = await axios.get(
          'https://02633170fd93f889.mokky.dev/sneakers'
        )
        const items = (orderData.items || []).map((item) => {
          const product = allProducts.find(
            (p) => p.id === (item.parentId || item.id)
          )
          return {
            id: item.id,
            title: product ? product.title : 'Товар',
            price: product ? product.price : 0,
            imageUrl: product
              ? product.imageUrl
              : `/sneakers/sneakers-${item.parentId || item.id || 1}.jpg`,
            quantity: item.quantity,
          }
        })
        order.value = {
          ...orderData,
          items,
          totalPrice: items.reduce(
            (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
            0
          ),
        }
      }
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      loading.value = false
    }
  }

  const confirmOrder = async () => {
    try {
      // Создаем заказ из корзины (используем текущие cartItems)
      const orderData = {
        items: cartItems.value,
        totalPrice: totalPrice.value,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      }

      await axios.post('https://02633170fd93f889.mokky.dev/orders', orderData)

      // Очищаем корзину через глобальный метод
      await clearCart()

      // Перенаправляем на страницу заказов
      router.push('/orders')
    } catch (error) {
      console.error('Error confirming order:', error)
    }
  }

  onMounted(async () => {
    await fetchCart() // Убедимся, что глобальная корзина актуальна
    await fetchOrder()
  })

  watch(cartItems, () => {
    if (route.query.id === undefined) {
      // If displaying current cart, update it when cartItems change
      order.value = {
        id: 'current-cart',
        status: 'pending',
        createdAt: new Date().toISOString(),
        items: cartItems.value,
        totalPrice: totalPrice.value,
      }
    }
  })

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'В обработке'
      case 'confirmed':
        return 'Подтвержден'
      case 'shipped':
        return 'Отправлен'
      case 'delivered':
        return 'Доставлен'
      case 'cancelled':
        return 'Отменен'
      default:
        return 'Неизвестно'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
</script>

<template>
  <main class="bg-white rounded-lg w-full p-7 h-none max-w-7xl mx-auto">
    <div
      class="flex flex-col md:flex-row gap-5 justify-between md:items-center my-10"
    >
      <h1 class="uppercase font-bold text-3xl">Подтверждение заказа</h1>
      <button
        @click="router.push('/')"
        class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
      >
        Вернуться к товарам
      </button>
    </div>

    <div
      v-if="loading"
      class="text-center py-20"
    >
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"
      ></div>
      <p class="mt-4 text-gray-600">Загружаем информацию о заказе...</p>
    </div>

    <div
      v-else-if="!order"
      class="text-center py-20"
    >
      <h2 class="text-2xl font-bold text-gray-600 mb-4">Заказ не найден</h2>
      <p class="text-gray-500 mb-6">Заказ с указанным ID не существует</p>
      <button
        @click="router.push('/')"
        class="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors"
      >
        Перейти к товарам
      </button>
    </div>

    <div
      v-else
      class="max-w-4xl mx-auto"
    >
      <div
        v-if="order.items && order.items.length === 0"
        class="text-center py-20"
      >
        <h2 class="text-2xl font-bold text-gray-600 mb-4">Корзина пуста</h2>
        <p class="text-gray-500 mb-6">Нет товаров для оформления заказа</p>
        <button
          @click="router.push('/')"
          class="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors"
        >
          Перейти к товарам
        </button>
      </div>
      <template v-else>
        <!-- Информация о заказе -->
        <div class="bg-gray-50 rounded-lg p-6 mb-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-2xl font-bold">Заказ #{{ order.id }}</h2>
            <span
              :class="`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`"
            >
              {{ getStatusText(order.status) }}
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-gray-600">Дата создания:</p>
              <p class="font-semibold">{{ formatDate(order.createdAt) }}</p>
            </div>
            <div>
              <p class="text-gray-600">Общая сумма:</p>
              <p class="text-2xl font-bold text-green-600">
                {{ order.totalPrice }} руб.
              </p>
            </div>
          </div>
        </div>

        <!-- Товары в заказе -->
        <div class="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h3 class="text-xl font-semibold mb-4">Товары в заказе</h3>

          <div
            v-if="order.items && order.items.length > 0"
            class="space-y-4"
          >
            <CartItem
              v-for="item in order.items"
              :key="item.id"
              :product="item"
              :hideRemove="true"
            />
          </div>

          <div
            v-else
            class="text-center py-8 text-gray-500"
          >
            Товары не найдены
          </div>
        </div>

        <!-- Кнопки действий -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            v-if="order.id === 'current-cart' && order.items.length > 0"
            @click="confirmOrder"
            class="bg-green-500 text-white px-8 py-3 rounded-md hover:bg-green-600 transition-colors font-semibold"
          >
            Подтвердить заказ
          </button>

          <button
            @click="router.push('/orders')"
            class="bg-blue-500 text-white px-8 py-3 rounded-md hover:bg-blue-600 transition-colors"
          >
            К заказам
          </button>

          <button
            @click="router.push('/')"
            class="bg-gray-500 text-white px-8 py-3 rounded-md hover:bg-gray-600 transition-colors"
          >
            К товарам
          </button>
        </div>
      </template>
    </div>
  </main>
</template>

<style scoped></style>
