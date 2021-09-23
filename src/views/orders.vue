<template>
  <com-padd-home>
    <transition appear="slide-fade">
      <router-view></router-view>
    </transition>
  </com-padd-home>
</template>

<script>
import comPaddHome from "../components/common/comPaddHome.vue";
export default {
  components: { comPaddHome },
  mounted() {
    this.$store.dispatch("getUsers");
    this.$store.dispatch("setRouteName", "Orders");
  },
};
</script>

<style lang="scss" scoped>
</style>