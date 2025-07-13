<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    product: {
      type: Object,
      required: true,
    },
    onRemove: {
      type: Function,
      default: () => {},
    },
  })

  const handleRemove = () => {
    props.onRemove(props.product.id)
  }

  const totalItemPrice = computed(() => {
    return props.product.price * props.product.quantity
  })

  const base = import.meta.env.BASE_URL
</script>

<template>
  <div
    class="m-1 shadow-sm rounded-lg p-3 flex sneakers-product-grid-item relative hover:-translate-y-1 transition-all duration-300 gap-3 items-center relative"
  >
    <img
      :src="
        product.imageUrl.startsWith('http')
          ? product.imageUrl
          : base + product.imageUrl.replace(/^\/+/, '')
      "
      alt="sneakers"
      class="w-25 h-auto aspect-square rounded-lg max-w-1/4"
    />
    <div class="flex flex-col gap-2">
      <p class="text-base leading-6 font-bold text-slate-700 pr-10">
        {{ product.title }}
      </p>

      <p class="text-lg">
        {{ product.price }} руб.
        <span v-if="product.quantity > 1"> × {{ product.quantity }}</span>
      </p>
      <p class="text-sm font-semibold text-green-600">
        Итого: {{ totalItemPrice }} руб.
      </p>
    </div>
    <div
      class="flex items-center justify-between sneakers-product-grid-item-info"
    >
      <img
        src="/close.svg"
        alt="remove from cart"
        title="Удалить из корзины"
        class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 cursor-pointer"
        @click.stop="handleRemove"
      />
    </div>
  </div>
</template>
