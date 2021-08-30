<template>
  <com-padd-home>
    <div class="about">
      <h1>This is an about page</h1>
    </div>
  </com-padd-home>
</template>
<script>
import comPaddHome from "../components/common/comPaddHome.vue";
export default {
  components: { comPaddHome },
  mounted() {
    this.$store.dispatch("setRouteName", "About");
  },
};
</script>
