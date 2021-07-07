<template>
  <b-card no-body class="h-100">
    <b-card-header class="p-2" style="background-color: #6c757d">
      <div>
        <div>All item groups</div>
        <!-- search -->
        <!-- <b-nav-form class="navbar-item" @submit.prevent="searchFn">
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
        </b-nav-form> -->
      </div>
    </b-card-header>

    <b-list-group flush style="overflow: auto">
      <b-list-group-item
        :active="Boolean(selectedItems.find((x) => x.id == item.id))"
        v-for="item in itemGroups"
        :key="item.id"
        class="py-1"
      >
        <b-row align-v="center" align-h="between" class="m-0">
          <b-col>
            <b-row>
              <div>
                {{ item.displayName["en"] }}
              </div>
            </b-row>
          </b-col>
          <b-col sm="1">
            <b-button size="sm" @click="addItem(item)">
              <b-icon icon="plus"></b-icon
            ></b-button>
          </b-col>
        </b-row>
      </b-list-group-item>
      <b-list-group-item
        v-if="lastItemGroup"
        action
        @click="loadMore"
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
  computed: {
    ...mapState({ itemGroups: (state) => state.item.itemGroups }),
    ...mapState({ lastItemGroup: (state) => state.item.lastItemGroup }),
  },
  mounted() {
    if (this.itemGroups.length == 0) {
      this.$store.dispatch("getItemsGroups");
    }
  },
  methods: {
    addItem(item) {
      this.$emit("addedItem", { id: item.id, name: item.displayName["en"] });
    },
    loadMore() {
      this.$store.dispatch("getItemsGroups");
    },
  },
};
</script>