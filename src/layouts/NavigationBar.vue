<template >
  <b-navbar
    class="pl-0"
    id="navbar"
    toggleable="lg"
    sticky
    type="light"
    variant="light"
  >
    <!-- using vuex to toggle sidebar -->
    <b-navbar-nav v-if="!sidebar">
      <b-nav-item @click="toggleSidebar()">
        <b-icon icon="justify"></b-icon>
      </b-nav-item>
    </b-navbar-nav>
    <!-- end-->

    <b-navbar-toggle class="logo" target="nav-collapse">
      <template #default="{ expanded }">
        <b-icon v-if="expanded" icon="chevron-bar-up"></b-icon>
        <b-icon v-else icon="chevron-bar-down"></b-icon>
      </template>
    </b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav style="width: 100%" align="end">
        <b-nav-item to="/dashboard" class="navbar-item">Dashboard</b-nav-item>
        <b-nav-item to="/about" class="navbar-item">About</b-nav-item>
        <b-nav-item to="/package" class="navbar-item">Package</b-nav-item>
        <b-nav-form class="navbar-item">
          <b-form-input size="sm" class="mr-sm-2" placeholder="Search">
          </b-form-input>
          <b-button size="sm" class="my-2 my-sm-0" type="submit">
            Search
          </b-button>
        </b-nav-form>
        <b-nav-item-dropdown
          class="navbar-item navbar-item-dropdown"
          text="Lang"
          right
        >
          <b-dropdown-item to="/">EN</b-dropdown-item>
          <b-dropdown-item to="/">ES</b-dropdown-item>
          <b-dropdown-item to="/">RU</b-dropdown-item>
          <b-dropdown-item to="/">FA</b-dropdown-item>
        </b-nav-item-dropdown>
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
</style>