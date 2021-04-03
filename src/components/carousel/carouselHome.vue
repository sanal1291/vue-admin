<template>
  <b-col>
    <h3>Carousels</h3>
    <b-row>
      <b-col md="5" class="pb-3">
        <b-row align-h="end" class="m-1" no-gutters>
          <b-button
            pill
            class="text-nowrap"
            size="sm"
            :to="{ name: 'CarouselAdd' }"
          >
            Add Carousel
          </b-button>
        </b-row>
        <b-list-group class="list-group" flush>
          <b-list-group-item
            v-for="item in carousels"
            :key="item.id"
            button
            @click="viewDetails(item.id)"
          >
            <div
              class="d-flex justify-content-between align-items-center w-100"
            >
              <div class="text-truncate">
                {{ item.displayNames["en"] }} <br />
                {{ item.displayNames["ml"] }}
              </div>
              <div class="flex-grow-0">
                <div v-if="item.isPackage">Package(s)</div>
                <div v-else>Items(s)</div>
              </div>
            </div>
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
              name: 'CarouselEdit',
              query: {
                edit: true,
                carousel: selectedCarousel != null ? selectedCarousel.id : null,
              },
            }"
          >
            Edit carousel
          </b-button>
        </b-row>
        <div class="package-details">
          <div>
            <b-card>
              <b-card-body v-if="selected" class="p-0">
                <b-row>
                  <b-col sm="6">
                    <h4>{{ selectedCarousel.displayNames["en"] }}</h4>
                    <h6>{{ selectedCarousel.displayNames["ml"] }}</h6>
                    <br />
                    <div>
                      Carousel for
                      <div>
                        <div v-if="selectedCarousel.isPackage">Package(s)</div>
                        <div v-else>Items(s)</div>
                      </div>
                    </div>
                  </b-col>
                  <b-col sm="6">
                    <b-img-lazy :src="selectedCarousel.image" fluid rounded>
                    </b-img-lazy>
                  </b-col>
                </b-row>
                <b-row>
                  <p class="text-center">
                    {{ selectedCarousel.isPackage ? "Packages" : "Items" }} in
                    carousel.
                  </p>
                </b-row>
                <b-row>
                  <div class="table-responsive">
                    <b-table
                      :fields="
                        selectedCarousel.isPackage ? packageFields : itemFields
                      "
                      :items="items"
                      responsive
                      small
                    ></b-table>
                  </div>
                </b-row>
              </b-card-body>
              <b-card-body v-else>
                Select a carousel to see details.
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
import { ItemCollection, packageCollection } from "../../firebase";
export default {
  computed: {
    ...mapState({ carousels: (state) => state.carousel.carousels }),
  },
  data() {
    return {
      selected: null,
      selectedCarousel: null,
      items: [],
      itemFields: ["displayName"],
      packageFields: ["displayNames"],
    };
  },
  methods: {
    viewDetails(id) {
      this.selected = id;
      this.selectedCarousel = this.carousels.find((x) => x.id == this.selected);
      let arr = [];
      this.selectedCarousel.items.forEach((element) => {
        if (this.selectedCarousel.isPackage) {
          packageCollection
            .doc(element)
            .get()
            .then((doc) => {
              arr.push(doc.data());
            });
        } else {
          ItemCollection.doc(element)
            .get()
            .then((doc) => {
              arr.push(doc.data());
            });
        }
      });
      this.items = arr;
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