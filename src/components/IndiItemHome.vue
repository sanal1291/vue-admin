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
        <b-col md="7" class="pb-3">
          <b-nav-form class="navbar-item py-1" @submit.prevent="searchFn">
            <b-form-input
              v-model.trim="searchValue"
              size="sm"
              class="mr-sm-2"
              placeholder="Search"
            >
            </b-form-input>
            <b-button size="sm" class="my-2 my-sm-0" type="submit">
              Search
            </b-button>
          </b-nav-form>
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
                  {{ item.name }}
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
                  {{ item.name }}
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
                  <h4>
                    {{ selectedIndiItem.name }}
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