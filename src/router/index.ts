import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/CheckParameters',
      name: 'CheckParameters',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/CheckParameters/index.vue')
    },
    {
        path: '/PriceComparison',  
        name: 'PriceComparison',
        // route level code-splitting
        // this generates a separate chunk (About.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('../views/PriceComparison/index.vue')
      },
      {
        path: '/CheckView',
        name: 'CheckView',
        // route level code-splitting
        // this generates a separate chunk (About.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('../views/CheckView/index.vue')
      },
      {
        path: '/PriceView',
        name: 'PriceView',
        // route level code-splitting
        // this generates a separate chunk (About.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('../views/PriceView/index.vue')
      },
  ]
})

export default router
