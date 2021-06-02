<template>
  <b-nav vertical justified>
    <b-nav-item
      v-for="(item, index) in navMainItems"
      :key="'item.type ' + index"
      active-class="selectedBorder"
      :to="item.to"
      class="w-100 overflow-hidden"
    >
      <div class="d-flex align-items-center">
        <b-icon :icon="item.icon" class="mr-2"></b-icon>
        <div class="pl-1 text-wrap" v-show="isMobile || sidebar">
          {{ item.name }}
        </div>
      </div>
    </b-nav-item>
    <hr class="my-2 w-100" />
    <b-nav-item
      v-for="(item, index) in navItems"
      :key="index"
      active-class="selectedBorder"
      :to="item.to"
      class="w-100 overflow-hidden"
    >
      <div class="d-flex align-items-center">
        <b-icon :icon="item.icon" class="mr-2"></b-icon>
        <div class="pl-1 text-wrap" v-show="isMobile || sidebar">
          {{ item.name }}
        </div>
      </div>
    </b-nav-item>
  </b-nav>
</template>
<script>
import { mapActions, mapState } from "vuex";
export default {
  props: ["vertical"],

  data: function () {
    return {
      expanded: false,
      navMainItems: [
        { to: "/dashboard", icon: "tools", name: "Dashboard" },
        { to: "/settings", icon: "tools", name: "Settings" },
      ],
      navItems: [
        { to: "/package", icon: "layers-half", name: "Packages" },
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
    ...mapState({ isMobile: (state) => state.sidebar.isMobile }),
  },
};
</script>

<style lang="scss" scoped>
.nav-item {
  font-weight: bold;
  transition: all 0.4s;
  &:hover {
    background-color: rgba($color: #c9c9c9, $alpha: 0.5);
  }
}
a {
  color: rgba($color: #000000, $alpha: 0.5) !important;
}
.selectedBorder {
  border-right: 5px solid green;
  transition: 0.2s border ease-in;
  transition: 0.2s all ease-in;
  background-color: rgba($color: #c9c9c9, $alpha: 0.5);
}
</style>