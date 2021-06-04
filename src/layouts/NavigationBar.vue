<template >
  <b-navbar
    class="pl-0 bottom_shadow"
    id="navbar"
    toggleable="md"
    sticky
    type="light"
  >
    <!-- using vuex to toggle sidebar -->
    <b-navbar-brand v-if="isMobile" class="d-flex align-items-center">
      <b-button variant="light" v-b-toggle.sidebar-backdrop>
        <b-icon icon="justify"></b-icon>
      </b-button>
      <b-link to="/" style="height: 40px">
        <b-img src="@/assets/logo.png" class="d-inline-block align-top"></b-img>
      </b-link>
    </b-navbar-brand>
    <!-- end-->

    <b-navbar-toggle class="logo" target="nav-collapse">
      <template #default="{ expanded }">
        <b-icon v-if="expanded" icon="chevron-bar-up"></b-icon>
        <b-icon v-else icon="chevron-bar-down"></b-icon>
      </template>
    </b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav class="ml-2" style="width: 100%" align="end">
        <b-nav-item to="/dashboard" class="navbar-item">Dashboard</b-nav-item>
        <b-nav-item to="/about" class="navbar-item">About</b-nav-item>
        <b-nav-item>{{ user }}</b-nav-item>
        <b-nav-item @click="logout()" class="navbar-item">Signout</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "NavigationBar",
  data: function () {
    return {
      test: null,
    };
  },
  computed: {
    ...mapState({ user: (state) => state.auth.user }),
    ...mapState({ sidebar: (state) => state.sidebar.sidebar }),
    ...mapState({ isMobile: (state) => state.sidebar.isMobile }),
  },
  methods: {
    ...mapActions(["toggleSidebar", "logout"]),
  },
};
</script>

<style lang="scss" scoped>
.router-link-exact-active {
  color: #000 !important;
}
.navbar-item {
  form {
    flex-wrap: nowrap;
  }
}
</style>