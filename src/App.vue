<template>
  <b-row
    no-gutters
    style="background-color: #dde4e7; min-height: 100vh"
    class="flex-nowrap"
  >
    <ismobile />
    <router-view name="sidebar"></router-view>
    <b-col class="d-flex flex-column">
      <router-view name="header"></router-view>
      <div
        id="body-content"
        class="flex-fill position-relative overflow-hidden"
      >
        <transition name="route-ani">
          <router-view class="route-child"></router-view>
        </transition>
      </div>
      <router-view name="footer"></router-view>
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
  components: { Ismobile },
};
</script>
<style lang="scss">
</style>