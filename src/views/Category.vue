<template>
  <com-padd-home>
    <category-home />
  </com-padd-home>
</template>

<script>
import CategoryHome from "../components/CategoryHome.vue";
import ComPaddHome from "../components/common/comPaddHome.vue";
export default {
  components: { CategoryHome, ComPaddHome },
  mounted() {
    this.$store.dispatch("setRouteName", "Categories");
  },
};
</script>

<style lang="scss" scoped>
</style>