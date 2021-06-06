<template>
  <b-card class="h-100 m-1">
    <template #header>
      <div class="d-flex justify-content-between">
        <h5>Areas</h5>
        <div>
          <b-button pill size="sm" :to="{ name: 'settingsareaAdd' }"
            >Add Area</b-button
          >
          <b-button
            class="ml-2"
            pill
            size="sm"
            :to="{
              name: 'settingsareaEdit',
              query: {
                edit: true,
                area: selectedArea ? selectedArea.id : null,
              },
            }"
            :disabled="!selectedArea"
            >Edit Area</b-button
          >
        </div>
      </div>
    </template>
    <template #default>
      <b-container fluid>
        <b-row class="pt-2">
          <b-col md="5" class="pb-3">
            <b-list-group class="list-group" flush v-if="areaLoading">
              Loading...
            </b-list-group>
            <b-list-group class="list-group" flush v-else>
              <b-list-group-item
                active-class="active"
                :active="item == selectedArea ? true : false"
                v-for="(item, index) in areas"
                :key="index"
                button
                @click="viewDetails(item)"
              >
                {{ item.name }}
              </b-list-group-item>
            </b-list-group>
          </b-col>
          <b-col md="7" class="pb-3">
            <div class="package-details">
              <div>
                <b-card>
                  <b-card-body v-if="selectedArea" class="p-0">
                    <b-overlay
                      :show="locationsLoading"
                      spinner-variant="primary"
                      spinner-type="grow"
                      spinner-small
                      rounded="sm"
                    >
                      <b-button @click="frefresh">f refresh</b-button>
                      <div>
                        <div>
                          <b-row>
                            <b-col cols="7">
                              Selected area :
                              <h5>{{ selectedArea.name }}</h5>
                            </b-col>
                            <b-col cols="5">
                              <b-img fluid :src="selectedArea.imageURL"></b-img>
                            </b-col>
                          </b-row>
                          <br />
                          <div>
                            <b-table
                              striped
                              show-empty
                              empty-text="No locations in selected area"
                              empty-filtered-text="No orders in given time period or id"
                              @row-selected="rowSelected"
                              selectable
                              select-mode="single"
                              sticky-header="400px"
                              hover
                              :fields="fields"
                              :busy="locationsLoading"
                              small
                              sort-icon-left
                              :items="locations[selectedArea.id]"
                            >
                              <template #cell(index)="{ index }">
                                {{ ++index }}
                              </template>
                              <!-- <template #cell(minAmount)="{ value }">
                              {{ typeof value }}{{ value }}
                            </template> -->
                            </b-table>
                          </div>
                        </div>
                      </div>
                    </b-overlay>
                  </b-card-body>
                  <b-card-body v-else>
                    Select a package to see details.
                  </b-card-body>
                </b-card>
              </div>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </template>
  </b-card>
</template>

<script>
import { mapState } from "vuex";
export default {
  data: function () {
    return {
      selectedArea: null,
      selectedLocation: null,
      fields: [
        "index",
        { key: "locality", sortable: true },
        { key: "minAmount", label: "Minimum order price" },
      ],
    };
  },
  computed: {
    ...mapState({ areas: (state) => state.settings.areas }),
    ...mapState({ areaLoading: (state) => state.settings.areaLoading }),
    ...mapState({
      locationsLoading: (state) => state.settings.locationsLoading,
    }),
    ...mapState({ locations: (state) => state.settings.locations }),
    // ...mapState({ areaImages: (state) => state.settings.areaImages }),
  },
  methods: {
    viewDetails(area) {
      this.selectedArea = area;
      this.$store.dispatch("getSettingsLocations", area);
    },
    frefresh() {
      this.$store.dispatch("getSettingsLocations", {
        id: this.selectedArea.id,
        forced: true,
      });
    },
    rowSelected(location) {
      this.selectedLocation = location;
    },
  },
};
</script>

<style lang="scss" scoped>
.list-group {
  max-height: 500px;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
.active {
  background-color: #6c757d;
  border-color: #6c757d;
}
</style>