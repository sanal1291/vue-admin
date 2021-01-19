import Vue from 'vue'
import VueRouter from 'vue-router'
import { auth } from '../firebase'
import Dashboard from '../views/Dashboard.vue'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Footer from '../layouts/Footer.vue'
import NavigationBar from '../layouts/NavigationBar.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter(to, from, next) {
      if (auth.currentUser) {
        next('/dashboard')
      } else {
        next()
      }
    },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    components: { default: Dashboard, footer: Footer, header: NavigationBar },
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/about',
    name: 'About',
    components: { default: About, footer: Footer, header: NavigationBar },
    meta: {
      requiresAuth: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)

  if (requiresAuth && !auth.currentUser) {
    next('')
  } else {
    next()
  }
})

export default router
