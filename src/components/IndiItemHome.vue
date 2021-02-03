<template>
  <div class="pt-2" style="position: relative">
    <router-view></router-view>
    <b-container fluid>
      <b-row class="flex-nowrap">
        <b-col sm="3">
          <h5>Indipendent Item</h5>
        </b-col>
        <b-col cols="auto">
          <b-button size="sm" :to="{ name: 'addIndiItem' }">Add</b-button>
        </b-col>
      </b-row>
      <b-row class="pt-2">
        <b-col md="5" class="pb-3">
          <b-list-group class="list-group" flush>
            <b-list-group-item
              v-for="item in indiItems"
              :key="item.id"
              button
              @click="viewDetails(item.id)"
            >
              <b-row>
                <b-col>
                  {{ item.displayNames["ml"] }} : {{ item.displayNames["en"] }}
                </b-col>
                <b-col> {{ item.price }}.Rs per {{ item.unitMeasured }}</b-col>
              </b-row>
            </b-list-group-item>
            <b-list-group-item class="text-center">
              <b-button @click="loadMore">Load more</b-button>
            </b-list-group-item>
          </b-list-group>
        </b-col>
        <b-col md="7" class="pb-3">
          <b-row align-h="end" class="m-1">
            <b-button
              pill
              class="text-nowrap"
              size="sm"
              :disabled="selectedIndiItem == null ? true : false"
              :to="{
                name: 'editIndiItem',
                query: {
                  edit: true,
                  indiItem: selectedIndiItem != null ? selectedIndiItem : null,
                  indiItemId:
                    selectedIndiItem != null ? selectedIndiItem.id : null,
                },
              }"
            >
              Edit Indipendent Item
            </b-button>
          </b-row>
          <div class="package-details">
            <div>
              <b-card>
                <b-card-body v-if="selected" class="p-0">
                  <b-row>
                    <b-col sm="6">
                      <h4>
                        {{ selectedIndiItem.id }}
                        {{ selectedIndiItem.displayNames["ml"] }}:
                        {{ selectedIndiItem.displayNames["en"] }}
                      </h4>
                      <br />
                      <div>
                        Price: {{ selectedIndiItem.price }}rs per
                        {{ selectedIndiItem.unitMeasured }}
                      </div>
                      <div>In stock: {{ selectedIndiItem.inStock }}</div>
                      <div>Rank : {{ selectedIndiItem.rank }}</div>
                    </b-col>
                    <b-col sm="6">
                      <b-img-lazy
                        :src="selectedIndiItem.imageUrl"
                        fluid
                        rounded
                      >
                      </b-img-lazy>
                    </b-col>
                  </b-row>
                  <b-row>
                    <p class="text-center">
                      Items in {{ selectedIndiItem.name }}.
                    </p>
                  </b-row>
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
    return { selectedIndiItem: null };
  },
  computed: {
    ...mapState({ indiItems: (state) => state.indiItems }),
    selected() {
      return this.selectedIndiItem ? true : false;
    },
  },
  beforeMount() {
    this.$store.dispatch("setIndiItems");
  },
  methods: {
    viewDetails(id) {
      this.selectedIndiItem = this.indiItems.find((item) => item.id == id);
    },
    loadMore() {
      this.$store.dispatch("setIndiItems");
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