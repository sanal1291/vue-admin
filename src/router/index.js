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
import orders from '../views/orders'
import Carousel from '../views/carousel'
import Settings from '../views/Settings'
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
import { orderAdd, ordersHome } from '../components/orders'
import { carouselHome, carouselAdd } from '../components/carousel'
import { settingsHome, popups, popupsAdd, aboutDetails, areaHome, areaAdd, area, holiday } from '../components/settings'
import Store from '../store/index'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter(to, from, next) {
      if (auth.currentUser && Store.state.auth.isAdmin) {
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
    path: '/settings',
    components: { default: Settings, footer: Footer, header: NavigationBar, sidebar: Sidebar },
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        name: 'Settings',
        component: settingsHome,
      },
      {
        path: 'popups',
        name: 'settingsPopups',
        component: popups,
        children: [
          {
            path: 'add',
            name: 'settingspopupsAdd',
            component: popupsAdd,
          },
          {
            path: 'edit',
            name: 'settingspopupsEdit',
            component: popupsAdd,
          }
        ]
      },
      {
        path: "area",
        component: area,
        children: [
          {
            path: '',
            component: areaHome,
            name: "settingsareaHome"
          },
          {
            path: 'add',
            name: "settingsareaAdd",
            component: areaAdd
          },
          {
            path: 'edit',
            name: "settingsareaEdit",
            component: areaAdd
          },
        ]
      },
      {
        path: "about",
        name: "settingsAbout",
        component: aboutDetails,
      },
      {
        path: "holiday",
        name: "settingsHoliday",
        component: holiday,
      },
    ]
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
    path: '/carousel',
    components: { default: Carousel, footer: Footer, header: NavigationBar, sidebar: Sidebar },
    meta: {
      requiresAuth: true
    },
    children: [
      {
        name: 'Carousel',
        path: '',
        component: carouselHome,
      },
      {
        name: 'CarouselAdd',
        path: 'add',
        component: carouselAdd,
      },
      {
        name: 'CarouselEdit',
        path: 'edit',
        component: carouselAdd,
      },
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
      path: '/itemgroups/add',
      component: ItemGroupAdd,
    },
    {
      name: "ItemGroupEdit",
      path: '/itemgroups/edit',
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
    path: '/orders',
    components: { default: orders, footer: Footer, header: NavigationBar, sidebar: Sidebar },
    children: [
      {
        path: '',
        name: "orderHome",
        component: ordersHome,
      },
      {
        path: 'add',
        name: 'orderAdd',
        component: orderAdd,
      },
      // {
      //   path: 'edit',
      //   name: 'orderEdit',
      //   component: orderAdd,
      // }
    ],
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
    next({ name: 'Home', query: { from: window.location.pathname } })
  } else {
    Store.state.sidebar.sidebar = false;
    next()
  }
})

export default router
