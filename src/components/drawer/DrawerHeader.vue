<script setup>
  defineProps({
    cartClose: {
      type: Function,
      required: true,
    },
  })
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <div @click="cartClose">
        <svg
          width="16"
          height="14"
          viewBox="0 0 16 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 7H14.7143"
            stroke="black"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M8.71436 1L14.7144 7L8.71436 13"
            stroke="black"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>

      <h2 class="text-2xl font-bold">Vue Sneakers</h2>
    </div>
  </div>
</template>
