<template>
  <b-card no-body class="h-100">
    <b-card-header class="p-2" style="background-color: #6c757d">
      <div class="d-flex align-items-center justify-content-between">
        <div>All items</div>
        <!-- search -->
        <b-nav-form class="navbar-item" @submit.prevent="searchFn">
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
      </div>
    </b-card-header>

    <b-list-group
      v-if="!search && indiItems.length"
      flush
      style="overflow: auto"
    >
      <b-list-group-item
        :active="Boolean(selectedItems.find((x) => x.id == item.id))"
        v-for="item in indiItems"
        :key="item.id"
        class="py-1"
      >
        <b-row align-v="center" align-h="between" class="m-0">
          <b-col cols="10">
            <b-row>
              <div>
                {{ item.name }}
              </div>
              <div class="pl-4">{{ item.price }} Rs</div>
            </b-row>
          </b-col>
          <b-col cols="2">
            <b-button size="sm" @click="addItem(item)">
              <b-icon icon="plus"></b-icon
            ></b-button>
          </b-col>
        </b-row>
      </b-list-group-item>
      <b-list-group-item
        v-if="itemLast"
        action
        @click="loadMore"
        class="text-center"
      >
        load more
      </b-list-group-item>
    </b-list-group>
    <b-list-group
      v-if="search && searchItems.length"
      flush
      style="overflow: auto"
    >
      <b-list-group-item
        v-for="item in searchItems"
        :active="Boolean(selectedItems.find((x) => x.id == item.id))"
        :key="item.id"
        class="py-1"
      >
        <b-row align-v="center" align-h="between" class="m-0">
          <b-col cols="10">
            <b-row>
              <div>
                {{ item.name }}
              </div>
              <div class="pl-4">{{ item.price }} Rs</div>
            </b-row>
          </b-col>
          <b-col cols="2">
            <b-button size="sm" @click="addItem(item)">
              <b-icon icon="plus"></b-icon
            ></b-button>
          </b-col>
        </b-row>
      </b-list-group-item>
      <b-list-group-item
        v-if="searchLast"
        action
        @click="loadMoreSearch"
        class="text-center"
      >
        load more
      </b-list-group-item>
    </b-list-group>
  </b-card>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: ["selectedItems"],
  data() {
    return {
      searchValue: "",
      search: false,
    };
  },
  computed: {
    ...mapState({ indiItems: (state) => state.indiItem.indiItems }),
    ...mapState({ searchItems: (state) => state.indiItem.searchIndiItems }),
    ...mapState({ searchLast: (state) => state.indiItem.searchIndiLast }),
    ...mapState({ itemLast: (state) => state.indiItem.itemIndiLast }),
  },
  mounted() {
    this.$store.dispatch("getIndiItems");
  },
  methods: {
    addItem(item) {
      this.$emit("addedItem", item);
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
  watch: {},
};
</script>

<style lang="scss" scoped>
</style>