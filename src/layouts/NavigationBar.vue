<template >
  <b-navbar id="navbar" toggleable="md" sticky type="dark" variant="dark">
    <b-navbar-brand id="navbar-brand" to="/" style="color: #808080">
      <img
        src="@/assets/logo.png"
        class="d-inline-block align-top"
      />UE</b-navbar-brand
    >
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
        <b-nav-item @click="logout()" class="navbar-item">Signout</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
export default {
  name: "NavigationBar",
  data: function () {
    return {
      test: null,
    };
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  .navbar-brand {
    height: 33px;
  }

  .navbar-item {
    .navbar-item-dropdown {
    }
    .router-link-exact-active {
      color: #fff !important;
    }
  }
}
</style>