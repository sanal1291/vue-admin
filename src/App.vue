<template>
  <b-row no-gutters style="background-color: #dde4e7" class="flex-nowrap">
    <router-view name="sidebar" style="position: sticky; top: 0"></router-view>
    <b-col>
      <router-view name="header"></router-view>
      <router-view></router-view>
      <router-view name="footer"></router-view>
    </b-col>
  </b-row>
</template>

<style lang="scss">
</style>