<template>
  <b-col>
    <h3>Item Groups</h3>
    <b-row>
      <b-col md="5" class="pb-3">
        <b-row align-h="end" class="m-1">
          <b-button pill class="text-nowrap" size="sm" :to="{ name: 'add' }">
            Add package
          </b-button>
        </b-row>
        <b-list-group class="list-group" flush>
          <b-list-group-item
            v-for="item in packages"
            :key="item.id"
            button
            @click="viewDetails(item.id)"
          >
            {{ item.displayNames["en"] }} <br />
            {{ item.displayNames["ml"] }}
          </b-list-group-item>
        </b-list-group>
      </b-col>
      <b-col md="7" class="pb-3">
        <b-row align-h="end" class="m-1">
          <b-button
            pill
            class="text-nowrap"
            size="sm"
            :disabled="selected == null ? true : false"
            :to="{
              name: 'edit',
              query: {
                edit: true,
                package: selectedPackage != null ? selectedPackage.id : null,
              },
            }"
          >
            Edit package
          </b-button>
        </b-row>
        <div class="package-details">
          <div>
            <b-card>
              <b-card-body v-if="selected" class="p-0">
                <b-row>
                  <b-col sm="6">
                    <h4>{{ selectedPackage.displayNames["en"] }}</h4>
                    <h6>{{ selectedPackage.displayNames["ml"] }}</h6>
                    <br />
                    <div>Price: {{ selectedPackage.price }}</div>
                    <br />
                    <div>Total: {{ selectedPackage.calculatedTotal }}</div>
                  </b-col>
                  <b-col sm="6">
                    <b-img-lazy :src="selectedPackage.img" fluid rounded>
                    </b-img-lazy>
                  </b-col>
                </b-row>
                <b-row>
                  <p class="text-center">Items in package.</p>
                </b-row>
                <b-row>
                  <div class="table-responsive">
                    <b-table-lite
                      :fields="fields"
                      :items="items"
                      responsive
                      small
                    ></b-table-lite>
                  </div>
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
  </b-col>
</template>

<script>
import { mapState } from "vuex";
import { indipendentItemCollection } from "../firebase";
export default {
  data() {
    return {
      selected: null,
      selectedPackage: null,
      items: [],
      fields: ["displayName", "quantity", "price", "total", "unit", "inStock"],
    };
  },
  computed: {
    ...mapState({ packages: (state) => state.packages }),
    ...mapState({ indiItems: (state) => state.indiItems }),
  },
  methods: {
    findPackage: function (item) {
      return item.id == this.selected;
    },
    viewDetails: function (id) {
      this.selected = id;
      this.selectedPackage = this.packages.find(this.findPackage);
      this.selectedPackage.calculatedTotal = 0;
      let arr = [];
      this.selectedPackage.items.forEach((element) => {
        indipendentItemCollection
          .doc(element.item)
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
              quantity: element.quantity,
              total: parseInt(element.quantity) * parseInt(doc.get("price")),
            })
          );
      });
      this.items = arr;
    },
  },
  watch: {
    items: function () {
      let value = 0;
      if (this.items.length == this.selectedPackage.items.length) {
        this.items.forEach(function (item) {
          value += parseInt(item.total);
        });
        this.selectedPackage.calculatedTotal = value;
      }
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