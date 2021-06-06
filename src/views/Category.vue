<template>
  <category-home />
</template>

<script>
import CategoryHome from "../components/CategoryHome.vue";
export default {
  components: { CategoryHome },
  mounted() {
    this.$store.dispatch("setRouteName", "Categories");
  },
};
</script>

<style lang="scss" scoped>
</style>