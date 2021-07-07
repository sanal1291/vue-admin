<template>
  <div class="h-100" style="position: relative">
    <router-view></router-view>
    <b-card class="h-100">
      <template #header>
        <div class="d-flex justify-content-between">
          <h5>Indipendent Item</h5>
          <div class="d-flex align-items-center">
            <b-nav-form class="navbar-item py-1" @submit.prevent="searchFn">
              <b-form-input
                v-model.trim="searchValue"
                size="sm"
                class="mr-sm-2"
                placeholder="Search"
              >
              </b-form-input>
              <b-button pill size="sm" class="my-2 my-sm-0" type="submit">
                Search
              </b-button>
            </b-nav-form>
            <div class="ml-2">
              <b-button pill size="sm" :to="{ name: 'addIndiItem' }"
                >Add</b-button
              >
            </div>
            <div>
              <b-button
                pill
                class="text-nowrap ml-2"
                size="sm"
                :disabled="selectedIndiItem == null ? true : false"
                :to="{
                  name: 'editIndiItem',
                  query: {
                    edit: true,
                    indiItemId:
                      selectedIndiItem != null ? selectedIndiItem.id : null,
                  },
                }"
              >
                Edit Indipendent Item
              </b-button>
            </div>
          </div>
        </div>
      </template>
      <template #default>
        <b-container fluid class="p-0">
          <b-row class="pt-2">
            <b-col md="7" class="pb-3">
              <b-list-group
                class="list-group"
                v-if="!search && indiItems.length"
                flush
              >
                <b-list-group-item
                  v-for="item in indiItems"
                  :key="item.id"
                  button
                  @click="viewDetails(item.id)"
                >
                  <div class="d-flex justify-content-between">
                    <div>
                      {{ item.displayNames["en"] }} :
                      {{ item.displayNames["ml"] || "ml not provided" }}
                    </div>
                    <div>{{ item.price }}.Rs</div>
                  </div>
                </b-list-group-item>
                <b-list-group-item
                  class="text-center"
                  v-if="itemLast"
                  @click="loadMore"
                  action
                >
                  Load more
                </b-list-group-item>
              </b-list-group>
              <b-list-group
                class="list-group"
                v-if="search && searchItems.length"
                flush
              >
                <b-list-group-item
                  v-for="item in searchItems"
                  :key="item.id"
                  button
                  @click="viewDetails(item.id)"
                >
                  <div class="d-flex justify-content-between">
                    <div>
                      {{ item.displayNames["en"] }} :
                      {{ item.displayNames["ml"] || "ml not provided" }}
                    </div>
                    <div>{{ item.price }}.Rs</div>
                  </div>
                </b-list-group-item>
                <b-list-group-item
                  class="text-center"
                  v-if="searchLast"
                  @click="loadMoreSearch"
                  action
                >
                  Load more
                </b-list-group-item>
              </b-list-group>
            </b-col>
            <b-col md="5" class="pb-3">
              <b-row align-h="end" class="m-1"> </b-row>
              <div class="package-details">
                <div>
                  <b-card>
                    <b-card-body v-if="selected" class="p-0">
                      <h4>
                        {{ selectedIndiItem.displayNames["en"] }} :
                        {{
                          selectedIndiItem.displayNames["ml"] ||
                          "ml not provided"
                        }}
                      </h4>
                      <br />
                      <div>Price: {{ selectedIndiItem.price }}Rs</div>
                      <div>stock: {{ selectedIndiItem.stock_quantity }}</div>
                    </b-card-body>
                    <b-card-body v-else>
                      Select a Item to see details.
                    </b-card-body>
                  </b-card>
                </div>
              </div>
            </b-col>
          </b-row>
        </b-container>
      </template>
    </b-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data: function () {
    return {
      searchValue: "",
      search: false,
      selectedIndiItem: null,
    };
  },
  computed: {
    ...mapState({ indiItems: (state) => state.indiItem.indiItems }),
    ...mapState({ searchItems: (state) => state.indiItem.searchIndiItems }),
    ...mapState({ searchLast: (state) => state.indiItem.searchIndiLast }),
    ...mapState({ itemLast: (state) => state.indiItem.itemIndiLast }),
    selected() {
      return this.selectedIndiItem ? true : false;
    },
  },
  beforeMount() {
    this.$store.dispatch("getIndiItems");
  },
  methods: {
    viewDetails(id) {
      this.selectedIndiItem = this.indiItems.find((item) => item.id == id);
    },
    searchFn() {
      if (this.searchValue.trim()) {
        this.search = true;
        this.$store.dispatch("getSearchIndiItems", {
          more: false,
          value: this.searchValue.trim().toLowerCase(),
        });
      } else {
        this.search = false;
      }
    },
    loadMoreSearch() {
      this.$store.dispatch("getSearchIndiItems", {
        more: true,
        value: this.searchValue.trim().toLowerCase(),
      });
    },
    loadMore() {
      this.$store.dispatch("getIndiItems");
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