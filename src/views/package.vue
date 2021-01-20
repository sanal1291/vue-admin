<template>
  <div>
    {{ this.$store.state.packages.packages }}
    <div v-for="item in packages" :key="item.id">{{ item.name }}</div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Package",
  computed: {
    ...mapState({ packages: (state) => state.packages.packages }),
  },
  beforeCreate: function () {
    this.$store.dispatch("setPackages");
  },
};
</script>

<style lang="scss" scoped>
</style>