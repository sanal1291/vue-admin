<template>
  <b-col>
    <h3>Item Groups</h3>
    <b-row>
      <b-col md="5" class="pb-3">
        <b-row align-h="end" class="m-1">
          <b-button
            pill
            class="text-nowrap"
            size="sm"
            :to="{ name: 'ItemGroupAdd' }"
          >
            Add Item Group
          </b-button>
        </b-row>
        <b-list-group class="list-group" flush>
          <b-list-group-item
            v-for="item in itemGroups"
            :key="item.id"
            button
            @click="viewDetails(item.id)"
          >
            {{ item.displayName["en"] }} : {{ item.displayName["ml"] }} <br />
            {{ item.varieties.length }} items
          </b-list-group-item>
          <b-list-group-item v-if="lastItemGroup" class="text-center">
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
        </b-row>
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
  </b-col>
</template>

<script>
import { mapState } from "vuex";
import { indipendentItemCollection } from "../firebase";
export default {
  data() {
    return {
      groupItem: null,
      indiItems: [],
      fields: ["name", "price", "stock_quantity"],
    };
  },
  computed: {
    ...mapState({ itemGroups: (state) => state.item.itemGroups }),
    ...mapState({ lastItemGroup: (state) => state.item.lastItemGroup }),
  },

  methods: {
    viewDetails: function (id) {
      this.groupItem = this.itemGroups.find((item) => item.id === id);
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
    loadMore() {
      this.$store.dispatch("getItemsGroups");
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