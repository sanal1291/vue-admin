<template>
  <b-row
    no-gutters
    style="background-color: #dde4e7; min-height: 100vh"
    class="flex-nowrap"
  >
    <ismobile />
    <!-- <router-view name="sidebar"></router-view> -->
    <sidebar></sidebar>
    <b-col class="d-flex flex-column">
      <!-- <router-view name="header"></router-view> -->
      <navigation-bar></navigation-bar>
      <div id="body-content" class="flex-fill">
        <router-view></router-view>
      </div>
      <!-- <router-view name="footer"></router-view> -->
      <footernav></footernav>
    </b-col>
  </b-row>
</template>
<script>
import { mapState } from "vuex";
import Ismobile from "./components/Ismobile.vue";
import Footernav from "./layouts/Footernav.vue";
import NavigationBar from "./layouts/NavigationBar.vue";
import Sidebar from "./layouts/Sidebar.vue";
export default {
  computed: {
    ...mapState({ redirect: (state) => state.auth.redirect }),
  },
  components: { Ismobile, Sidebar, NavigationBar, Footernav },
};
</script>
<style lang="scss">
</style>