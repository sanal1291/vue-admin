<template>
  <div class="pt-2" style="position: relative">
    <b-container fluid>
      <b-row class="flex-nowrap">
        <b-col sm="3">
          <h5>Areas</h5>
        </b-col>
        <b-col cols="auto"
          ><b-button size="sm" :to="{ name: 'settingsareaAdd' }">Add</b-button>
        </b-col>
      </b-row>
      <b-row class="pt-2">
        <b-col md="5" class="pb-3">
          <b-list-group class="list-group" flush v-if="loadingAdmin">
            Loading...
          </b-list-group>
          <b-list-group class="list-group" flush v-else>
            <b-list-group-item
              v-for="(item, index) in adminDetails.areaNames"
              :key="index"
              button
              @click="viewDetails(item)"
            >
              {{ item }}
            </b-list-group-item>
          </b-list-group>
        </b-col>
        <b-col md="7" class="pb-3">
          <div class="package-details">
            <div>
              <b-card>
                <b-card-body v-if="selectedArea" class="p-0">
                  <b-button @click="frefresh">f refresh</b-button>
                  <div>
                    <div>
                      <h5>Selected area : {{ selectedArea }}</h5>
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
                          :items="locations[selectedArea]"
                        >
                        </b-table>
                      </div>
                    </div>
                  </div>
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
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data: function () {
    return {
      selectedArea: null,
      selectedLocation: null,
      fields: ["index", "locality"],
    };
  },
  computed: {
    ...mapState({ adminDetails: (state) => state.settings.adminDetails }),
    ...mapState({ loadingAdmin: (state) => state.settings.loadingAdmin }),
    ...mapState({
      locationsLoading: (state) => state.settings.locationsLoading,
    }),
    ...mapState({ locations: (state) => state.settings.locations }),
    selected() {
      return this.selectedCategory ? true : false;
    },
  },
  methods: {
    viewDetails(area) {
      this.selectedArea = area;
      this.$store.dispatch("getSettingsLocations", { area: area });
    },
    frefresh() {
      this.$store.dispatch("getSettingsLocations", {
        area: this.selectedArea,
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
</style>