<template>
  <div class="px-1 px-md-2 pt-2 pt-md-3 pb-2 h-100">
    <transition name="child-ani">
      <slot> </slot>
    </transition>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.child-ani-enter {
  -webkit-transform: scale(0.95, 0.95);
  transform: scale(0.95, 0.95);
  opacity: 0;
}
.child-ani-leave-to {
  -webkit-transform: scale(1.05, 1.05);
  transform: scale(1.05, 1.05);
  opacity: 0;
}
.child-ani-enter-to {
  opacity: 1;
}
.child-ani-leave {
  opacity: 1;
}
.child-ani-enter-active {
  // position: absolute;
  transition: all 0.4s;
}
.child-ani-leave-active {
  position: relative;
  transition: all 0.2s;
}
</style>