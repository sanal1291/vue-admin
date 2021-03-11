import Vue from 'vue'
import VueRouter from 'vue-router'
import { auth } from '../firebase'
import Dashboard from '../views/Dashboard.vue'
// views
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Package from '../views/Package.vue'
import Category from '../views/Category'
import ItemGroup from '../views/ItemGroup'
import IndiItem from '../views/IndiItem'
// layouts
import Footer from '../layouts/Footer.vue'
import NavigationBar from '../layouts/NavigationBar.vue'
import Sidebar from '../layouts/Sidebar.vue'
// components
import PackageHome from '../components/PackageHome'
import PackageEdit from '../components/PackageEdit'
import CategoryAdd from '../components/CategoryAdd'
import IndiItemAdd from '../components/IndiItemAdd'
import ItemGroupHome from '../components/ItemGroupHome'
import ItemGroupAdd from '../components/ItemGroupAdd'


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
    components: { default: Dashboard, footer: Footer, header: NavigationBar, sidebar: Sidebar },
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/category',
    name: 'Category',
    components: { default: Category, footer: Footer, header: NavigationBar, sidebar: Sidebar },
    children: [
      {
        path: '/category/add',
        name: 'addCategory',
        component: CategoryAdd,
      }, {
        path: '/category/edit',
        name: 'editCategory',
        component: CategoryAdd,
      }],
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/package',
    components: { default: Package, footer: Footer, header: NavigationBar, sidebar: Sidebar },
    meta: {
      requiresAuth: true
    },
    children: [
      {
        name: 'Package',
        path: '',
        component: PackageHome,
      },
      {
        name: "edit",
        path: '/package/edit',
        component: PackageEdit,
      },
      {
        name: "add",
        path: '/package/add',
        component: PackageEdit,
      }
    ]
  },
  {
    path: '/itemgroups',
    components: { default: ItemGroup, footer: Footer, header: NavigationBar, sidebar: Sidebar },
    children: [{
      name: "ItemGroup",
      path: '',
      component: ItemGroupHome,
    },
    {
      name: "ItemGroupAdd",
      path: '/itemGroups/add',
      component: ItemGroupAdd,
    },
    {
      name: "ItemGroupEdit",
      path: '/itemGroups/edit',
      component: ItemGroupAdd,
    }],
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/indiItem',
    name: 'IndiItem',
    components: { default: IndiItem, footer: Footer, header: NavigationBar, sidebar: Sidebar },
    children: [
      {
        path: '/indiItem/add',
        name: 'addIndiItem',
        component: IndiItemAdd,
      }, {
        path: '/indiItem/edit',
        name: 'editIndiItem',
        component: IndiItemAdd,
      }],
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/about',
    name: 'About',
    components: { default: About, footer: Footer, header: NavigationBar, sidebar: Sidebar },
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
