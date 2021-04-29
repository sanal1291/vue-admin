<template>
  <div class="pt-2" style="position: relative">
    <router-view></router-view>
    <b-container fluid>
      <b-row class="flex-nowrap">
        <b-col sm="3">
          <h5>Popup messages</h5>
        </b-col>
        <b-col cols="auto">
          <b-button
            size="sm"
            :to="{
              name: 'settingspopupsAdd',
              query: {
                edit: false,
              },
            }"
            >Add</b-button
          >
          <span class="p-2"></span>
        </b-col>
      </b-row>
      <b-row class="pt-2">
        <b-col cols="12" md="8" class="pb-3">
          <b-list-group class="list-group" flush v-if="adminDetails">
            <b-list-group-item
              v-for="(item, index) in adminDetails.messages"
              :key="index"
            >
              <div class="d-flex justify-content-between align-items-center">
                <div class="text-wrap">{{ item }}</div>
                <b-button
                  size="sm"
                  variant="light"
                  :to="{
                    name: 'settingspopupsEdit',
                    query: {
                      edit: true,
                      index: index,
                    },
                  }"
                >
                  <b-icon icon="pen-fill" animation="pulse"></b-icon
                ></b-button>
              </div>
            </b-list-group-item>
          </b-list-group>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({ adminDetails: (state) => state.settings.adminDetails }),
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.list-group {
  max-height: 500px;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
</style>