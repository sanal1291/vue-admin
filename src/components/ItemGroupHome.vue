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
            {{ item.displayNames["en"] }} <br />
            {{ item.displayNames["ml"] }} <br />
            {{ item.id }}
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
            :disabled="groupItem == null ? true : false"
            :to="{
              name: 'edit',
              query: {
                edit: true,
                itemGroup: groupItem != null ? groupItem.id : null,
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
                    <h4>{{ groupItem.displayNames["en"] }}</h4>
                    <h6>{{ groupItem.displayNames["ml"] }}</h6>
                  </b-col>
                  <b-col sm="6">
                    <b-img-lazy :src="groupItem.img" fluid rounded>
                    </b-img-lazy>
                  </b-col>
                </b-row>
                <p class="text-center">Items in Item groups.</p>
                {{ groupItem.varieties }}
                <b-row>
                  <div class="table-responsive">
                    <b-table-lite
                      :fields="fields"
                      :items="indiItems"
                      responsive
                      small
                    ></b-table-lite>
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
      fields: ["displayName", "price", "unit", "inStock"],
    };
  },
  computed: {
    ...mapState({ itemGroups: (state) => state.items }),
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
              displayName: doc.get("displayName"),
              img: doc.get("imageUrl"),
              category: doc.get("category"),
              price: doc.get("price"),
              unit: doc.get("unitMeasured"),
              inStock: doc.get("inStock"),
            })
          );
      });
      this.indiItems = arr;
    },
    loadMore() {
      this.$store.dispatch("setItems");
    },
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