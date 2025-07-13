<script setup>
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const props = defineProps({
    totalPrice: {
      type: Number,
      default: 0,
    },
  })

  const emit = defineEmits(['drawerClose'])

  const goToOrderConfirmation = () => {
    if (props.totalPrice === 0) return
    emit('drawerClose')
    router.push('/order-confirmation')
  }
</script>

<template>
  <div class="flex flex-col items-center p-5">
    <h4 class="text-base text-slate-700">Итого</h4>
    <p class="text-xl font-bold text-slate-700">{{ totalPrice }} руб.</p>
  </div>
  <button
    @click="goToOrderConfirmation"
    :disabled="totalPrice === 0"
    class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
  >
    Оформить заказ
  </button>
</template>
