<template>
  <b-card class="h-100">
    <template #header>
      <div class="between-center-flex-md">
        <div>
          <h5>Item groups</h5>
        </div>
        <div>
          <div
            class="
              d-flex
              align-items-center
              justify-content-center
              flex-wrap
              float-right
            "
          >
            <b-form
              class="navbar-item d-flex align-items-center"
              @submit.prevent="searchFn"
            >
              <b-form-input
                v-model.trim="searchValue"
                size="sm"
                class="mr-2"
                placeholder="Search"
              >
              </b-form-input>
              <b-button pill size="sm" class="my-2 my-sm-0" type="submit">
                Search
              </b-button>
            </b-form>
            <div class="d-flex flex-nowrap">
              <div class="ml-2">
                <b-button
                  pill
                  class="text-nowrap"
                  size="sm"
                  :to="{ name: 'ItemGroupAdd' }"
                >
                  Add Item Group
                </b-button>
              </div>
              <div>
                <b-button
                  pill
                  class="text-nowrap ml-2"
                  size="sm"
                  :disabled="groupItem == null ? true : false"
                  :to="{
                    name: 'ItemGroupEdit',
                    query: {
                      edit: true,
                      groupItem: groupItem != null ? groupItem : null,
                      groupItemId: groupItem != null ? groupItem.id : null,
                    },
                  }"
                >
                  Edit Item Group
                </b-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #default>
      <b-container fluid class="p-0">
        <b-row>
          <b-col md="5" class="pb-3">
            <b-list-group
              class="list-group"
              v-if="!search && itemGroups.length"
              flush
            >
              <b-list-group-item
                active-class="active"
                :active="item === groupItem ? true : false"
                v-for="item in itemGroups"
                :key="item.id"
                button
                @click="viewDetails(item.id)"
              >
                {{ item.displayName["en"] }} : {{ item.displayName["ml"] }}
                <br />
                {{ item.varieties.length }} items
              </b-list-group-item>
              <b-list-group-item v-if="lastItemGroup" class="text-center">
                <b-button @click="loadMore">Load more</b-button>
              </b-list-group-item>
            </b-list-group>
            <b-list-group
              class="list-group"
              v-if="search && searchItemGroups.length"
              flush
            >
              <h6>Seach Results</h6>
              <b-list-group-item
                active-class="active"
                :active="item === groupItem ? true : false"
                v-for="item in searchItemGroups"
                :key="item.id"
                button
                @click="viewDetails(item.id)"
              >
                {{ item.displayName["en"] }} : {{ item.displayName["ml"] }}
                <br />
                {{ item.varieties.length }} items
              </b-list-group-item>
              <b-list-group-item
                v-if="lastSearchItemGroup"
                action
                class="text-center"
              >
                <b-button @click="loadMoreSearch">Load more</b-button>
              </b-list-group-item>
            </b-list-group>
          </b-col>
          <b-col md="7" class="pb-3">
            <b-row align-h="end" class="m-1"> </b-row>
            <div class="package-details">
              <div>
                <b-card>
                  <b-card-body v-if="groupItem" class="p-0">
                    <b-row>
                      <b-col sm="6">
                        <h4>{{ groupItem.displayName["en"] }}</h4>
                        <h6>{{ groupItem.displayName["ml"] }}</h6>
                        <div>Items: {{ groupItem.varieties.length }}</div>
                      </b-col>
                      <b-col sm="6">
                        <b-img-lazy :src="groupItem.imageUrl" fluid rounded>
                        </b-img-lazy>
                      </b-col>
                    </b-row>
                    <p class="text-center">Items in Item groups.</p>
                    <b-row>
                      <div class="table-responsive">
                        <b-table
                          :fields="fields"
                          :items="indiItems"
                          responsive
                          small
                        ></b-table>
                      </div>
                      <p class="w-100">
                        {{ groupItem }}
                      </p>
                    </b-row>
                  </b-card-body>
                  <b-card-body v-else>
                    Select a Item Group to see details.
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
import { indipendentItemCollection } from "../firebase";
export default {
  data() {
    return {
      searchValue: "",
      search: false,
      groupItem: null,
      indiItems: [],
      fields: ["name", "price", "stock_quantity"],
    };
  },
  computed: {
    ...mapState({ itemGroups: (state) => state.item.itemGroups }),
    ...mapState({ lastItemGroup: (state) => state.item.lastItemGroup }),
    ...mapState({ searchItemGroups: (state) => state.item.searchItemGroups }),
    ...mapState({
      lastSearchItemGroup: (state) => state.item.lastSearchItemGroup,
    }),
  },

  methods: {
    viewDetails: function (id) {
      if (this.search) {
        this.groupItem = this.searchItemGroups.find((item) => item.id === id);
      } else {
        this.groupItem = this.itemGroups.find((item) => item.id === id);
      }
      let arr = [];
      this.groupItem.varieties.forEach((element) => {
        indipendentItemCollection
          .doc(element.itemId)
          .get()
          .then((doc) =>
            arr.push({
              id: doc.id,
              name: doc.get("name"),
              category: doc.get("category"),
              price: doc.get("price"),
              stock_quantity: doc.get("stock_quantity"),
            })
          );
      });
      this.indiItems = arr;
    },
    searchFn() {
      if (this.searchValue.trim()) {
        this.search = true;
        this.$store.dispatch("getSearchItemGroups", {
          more: false,
          value: this.searchValue.trim().toLowerCase(),
        });
      } else {
        this.search = false;
      }
    },
    loadMore() {
      this.$store.dispatch("getItemsGroups");
    },
    loadMoreSearch() {
      this.$store.dispatch("getSearchItemGroups", {
        more: true,
        value: this.searchValue.trim().toLowerCase(),
      });
    },
  },
  mounted() {
    this.$store.dispatch("getItemsGroups", true);
  },
};
</script>

<style lang="scss" scoped>
.package-header {
  max-width: 500px;
}
.list-group {
  max-height: 500px;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
.package-details {
  min-height: 400px;
}
</style>