import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import FinalHeart from '../views/FinalHeart.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/final',
    name: 'Final',
    component: FinalHeart
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 