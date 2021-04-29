<template>
  <b-col
    id="sidebar"
    cols="auto"
    class="vh-100 bg-light"
    :class="sidebar ? 'expanded' : 'shrinked'"
  >
    <b-row no-gutters class="sidebar-navbar">
      <b-navbar class="p-1 w-100 h-100" variant="light" type="light">
        <b-navbar-brand class="h-100 m-0" to="/" style="color: #808080">
          <img src="@/assets/logo.png" class="d-inline-block align-top" />
        </b-navbar-brand>
        <b-navbar-nav v-if="sidebar" class="w-100" align="end" fill>
          <b-nav-item @click="toggleSidebar()">
            <b-icon class="float-right" icon="arrow-left"></b-icon>
          </b-nav-item>
        </b-navbar-nav>
      </b-navbar>
    </b-row>
    <b-row>
      <b-col>
        <b-nav vertical justified>
          <b-nav-item
            v-for="(item, index) in navItems"
            :key="index"
            active-class="selectedBorder"
            :to="item.to"
            class="w-100 overflow-hidden"
          >
            <div class="d-flex align-items-center">
              <b-icon :icon="item.icon" class="mr-2"></b-icon>
              <div class="pl-1 text-wrap" v-show="sidebar">
                {{ item.name }}
              </div>
            </div>
          </b-nav-item>
        </b-nav>
      </b-col>
    </b-row>
  </b-col>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "Sidebar",
  data: function () {
    return {
      expanded: false,
      navItems: [
        { to: "/package", icon: "layers-half", name: "Packages" },
        { to: "/settings", icon: "tools", name: "Settings" },
        { to: "/category", icon: "grid", name: "Category" },
        { to: "/itemgroups", icon: "layers", name: "Group items" },
        { to: "/indiItem", icon: "layers-half", name: "Independent Items" },
        { to: "/carousel", icon: "card-image", name: "Carousel" },
        { to: "/orders", icon: "basket", name: "Orders" },
        // { to: "", icon: "", name: "" },
      ],
    };
  },
  computed: {
    ...mapState({ sidebar: (state) => state.sidebar.sidebar }),
  },
  methods: {
    ...mapActions(["toggleSidebar"]),
    toggle: function () {
      this.expanded = !this.expanded;
    },
  },
};
</script>

<style lang="scss" scoped>
#sidebar {
  transition: width 0.2s;
  .sidebar-navbar {
    height: 60px;
  }
  .nav-item {
    font-weight: bold;
    transition: all 0.4s;
  }
}
.expanded {
  width: 150px;
}
.shrinked {
  width: 55px;
}
a {
  color: rgba($color: #000000, $alpha: 0.5) !important;
}
.selectedBorder {
  border-left: 5px solid green;
  transition: 0.2s border ease-in;
  transition: 0.2s all ease-in;
  background-color: rgba($color: #c9c9c9, $alpha: 0.5);
}
</style>