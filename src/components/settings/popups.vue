<template>
  <com-padd-home>
    <div class="h-100" style="position: relative">
      <router-view></router-view>
      <b-card class="h-100">
        <template #header>
          <div class="d-flex justify-content-between">
            <h5>Popup messages</h5>

            <div>
              <b-button
                pill
                size="sm"
                :to="{
                  name: 'settingspopupsAdd',
                  query: {
                    edit: false,
                  },
                }"
                >Add message</b-button
              >
            </div>
          </div>
        </template>
        <template #default>
          <b-container fluid class="p-0">
            <b-row class="pt-2">
              <b-col cols="12" md="8" class="pb-3">
                <b-list-group class="list-group" flush v-if="adminDetails">
                  <b-list-group-item
                    v-for="(item, index) in adminDetails.messages"
                    :key="index"
                  >
                    <div
                      class="d-flex justify-content-between align-items-center"
                    >
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
        </template>
      </b-card>
    </div>
  </com-padd-home>
</template>

<script>
import { mapState } from "vuex";
import comPaddHome from "../common/comPaddHome.vue";
export default {
  components: { comPaddHome },
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