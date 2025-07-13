<script setup>
  import { ref, onMounted, computed, inject } from 'vue'
  import axios from 'axios'
  import { useRouter } from 'vue-router'

  const base = import.meta.env.BASE_URL

  const { cartItems, totalPrice, fetchCart } = inject('cartStore', {
    cartItems: ref([]),
    totalPrice: computed(() => 0),
    addToCart: () => {},
    removeFromCart: () => {},
    cartOpen: () => {},
    fetchCart: () => {},
  })

  const router = useRouter()
  const orders = ref([])
  const loading = ref(true)

  const fetchOrders = async () => {
    try {
      loading.value = true
      const { data: ordersData } = await axios.get(
        'https://02633170fd93f889.mokky.dev/orders'
      )
      // Обогащаем данные заказа товарами из общего списка товаров
      const { data: allProducts } = await axios.get(
        'https://02633170fd93f889.mokky.dev/sneakers'
      )

      orders.value = ordersData.map((order) => ({
        ...order,
        items: order.items.map((item) => {
          const product = allProducts.find(
            (p) => p.id === item.parentId || item.id
          )
          return product
            ? {
                ...item,
                title: product.title,
                imageUrl: product.imageUrl,
                price: product.price,
              }
            : item
        }),
      }))
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      loading.value = false
    }
  }

  onMounted(async () => {
    await fetchOrders()
    await fetchCart()
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
      <h1 class="uppercase font-bold text-3xl">История заказов</h1>
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
      <p class="mt-4 text-gray-600">Загружаем заказы...</p>
    </div>

    <div
      v-else-if="orders.length === 0"
      class="text-center py-20"
    >
      <h2 class="text-2xl font-bold text-gray-600 mb-4">Заказов пока нет</h2>
      <p class="text-gray-500 mb-6">
        Сделайте свой первый заказ, чтобы он появился здесь
      </p>
      <button
        @click="router.push('/')"
        class="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors"
      >
        Перейти к товарам
      </button>
    </div>

    <div
      v-else
      class="space-y-6"
    >
      <div
        v-for="order in orders"
        :key="order.id"
        class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
      >
        <div
          class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div class="flex-1">
            <div class="flex items-center gap-4 mb-2">
              <h3 class="text-lg font-semibold">Заказ #{{ order.id }}</h3>
              <span
                :class="`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`"
              >
                {{ getStatusText(order.status) }}
              </span>
            </div>
            <p class="text-gray-600 mb-2">
              Создан: {{ formatDate(order.createdAt || order.date) }}
            </p>
            <p class="text-lg font-bold text-green-600">
              Сумма: {{ order.totalPrice || order.price || 0 }} руб.
            </p>
          </div>

          <div class="flex gap-2">
            <button
              @click="router.push(`/order-confirmation?id=${order.id}`)"
              class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors text-sm"
            >
              Подробности
            </button>
          </div>
        </div>

        <div
          v-if="order.items && order.items.length > 0"
          class="mt-4"
        >
          <h4 class="font-semibold mb-2">Товары в заказе:</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div
              v-for="item in order.items"
              :key="item.id"
              class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <img
                :src="
                  item.imageUrl ||
                  base + 'sneakers/sneakers-' + (item.id || 1) + '.jpg'
                "
                :alt="item.title"
                class="w-12 h-12 object-cover rounded"
              />
              <div class="flex-1">
                <p class="font-medium text-sm">{{ item.title }}</p>
                <p class="text-gray-600 text-sm">
                  {{ item.quantity }} шт. × {{ item.price }} руб.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
