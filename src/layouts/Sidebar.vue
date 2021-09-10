<template>
  <div v-if="isMobile">
    <b-sidebar id="sidebar-backdrop" backdrop-variant="dark" backdrop shadow>
      <template #title> FreshGrown-admin </template>
      <template #default>
        <sidebar-contents />
      </template>
    </b-sidebar>
  </div>
  <!-- desktop -->
  <div v-else>
    <div
      id="sidebard"
      style="position: sticky; top: 0"
      class="vh-100 bg-light d-flex justify-content-between flex-column"
      :class="sidebar ? 'expanded' : 'shrinked'"
    >
      <b-container fluid class="p-0">
        <b-row no-gutters class="sidebar-navbar" align-h="center">
          <b-navbar class="p-1 h-100" variant="light" type="light">
            <b-navbar-brand class="h-100 m-0" to="/" style="color: #808080">
              <img src="@/assets/logo.png" class="d-inline-block align-top" />
            </b-navbar-brand>
          </b-navbar>
        </b-row>
        <b-row>
          <b-col>
            <sidebar-contents />
          </b-col>
        </b-row>
      </b-container>

      <div class="w-100">
        <hr class="my-1" />
        <b-button variant="light" @click="toggleSidebar" class="w-100"
          ><b-icon :rotate="sidebar ? 180 : 0" icon="box-arrow-right"></b-icon
        ></b-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import sidebarContents from "./sidebarContents.vue";
export default {
  components: { sidebarContents },
  computed: {
    ...mapState({ isMobile: (state) => state.sidebar.isMobile }),
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
#sidebard {
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
  width: 200px;
}
.shrinked {
  width: 55px;
}
a {
  color: rgba($color: #000000, $alpha: 0.5) !important;
}
</style>