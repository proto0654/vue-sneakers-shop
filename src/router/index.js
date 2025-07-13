import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FavoritesView from '../views/FavoritesView.vue'
import OrdersView from '../views/OrdersView.vue'
import OrderConfirmationView from '../views/OrderConfirmationView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: FavoritesView,
  },
  {
    path: '/orders',
    name: 'orders',
    component: OrdersView,
  },
  {
    path: '/order-confirmation',
    name: 'order-confirmation',
    component: OrderConfirmationView,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
