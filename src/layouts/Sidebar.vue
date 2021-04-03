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
            active-class="selectedBorder"
            to="/package"
            class="text-nowrap overflow-hidden"
          >
            <b-icon icon="box-seam"></b-icon
            ><span v-if="sidebar"> Packages</span>
          </b-nav-item>
          <b-nav-item
            active-class="selectedBorder"
            to="/category"
            class="text-nowrap overflow-hidden"
          >
            <b-icon icon="grid"></b-icon><span v-if="sidebar"> Category</span>
          </b-nav-item>
          <b-nav-item
            active-class="selectedBorder"
            to="/itemgroups"
            class="text-nowrap overflow-hidden"
          >
            <b-icon icon="layers"></b-icon
            ><span v-if="sidebar"> Group items</span>
          </b-nav-item>
          <b-nav-item
            active-class="selectedBorder"
            to="/indiItem"
            class="text-nowrap overflow-hidden w-100"
          >
            <div class="d-flex align-items-center">
              <b-icon icon="layers-half"></b-icon>
              <div class="pl-1" v-if="sidebar">
                Independent <br />
                Items
              </div>
            </div>
          </b-nav-item>
          <b-nav-item
            active-class="selectedBorder"
            to="/carousel"
            class="text-nowrap overflow-hidden"
          >
            <b-icon icon="card-image"></b-icon
            ><span v-if="sidebar"> Carousel</span>
          </b-nav-item>
          <b-nav-item
            active-class="selectedBorder"
            to="/orders"
            class="text-nowrap overflow-hidden"
          >
            <b-icon icon="basket"></b-icon><span v-if="sidebar"> Orders</span>
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