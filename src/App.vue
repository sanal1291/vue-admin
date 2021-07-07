<template>
  <b-row no-gutters style="background-color: #dde4e7" class="flex-nowrap">
    <ismobile />
    <router-view name="sidebar"></router-view>
    <b-col class="d-flex flex-column">
      <router-view name="header"></router-view>
      <div id="body-content" class="flex-fill">
        <router-view></router-view>
      </div>
      <router-view name="footer"></router-view>
    </b-col>
  </b-row>
</template>
<script>
import { mapState } from "vuex";
import Ismobile from "./components/Ismobile.vue";
export default {
  computed: {
    ...mapState({ redirect: (state) => state.auth.redirect }),
  },
  components: { Ismobile },
};
</script>
<style lang="scss">
</style>