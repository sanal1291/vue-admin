<template>
  <div style="position: relative" class="h-100">
    <router-view class="h-100"></router-view>
    <b-card class="h-100 m-1">
      <template #header>
        <div class="d-flex justify-content-between">
          <h5>Category</h5>
          <div>
            <b-button pill size="sm" :to="{ name: 'addCategory' }"
              >Add Category</b-button
            >
            <b-button
              pill
              class="ml-2 text-nowrap"
              size="sm"
              :disabled="selectedCategory == null ? true : false"
              :to="{
                name: 'editCategory',
                query: {
                  edit: true,
                  category:
                    selectedCategory != null ? selectedCategory.id : null,
                },
              }"
            >
              Edit Category
            </b-button>
          </div>
        </div>
      </template>
      <template #default>
        <b-container fluid class="p-0">
          <b-row class="pt-2">
            <b-col md="5" class="pb-3">
              <b-list-group class="list-group" flush>
                <b-list-group-item
                  v-for="item in categories"
                  :key="item.id"
                  button
                  @click="viewDetails(item.id)"
                >
                  {{ item.displayNames["en"] }} :
                  {{ item.displayNames["ml"] || "ml not provided" }}
                </b-list-group-item>
              </b-list-group>
            </b-col>
            <b-col md="7" class="pb-3">
              <b-row align-h="end" class="m-1"> </b-row>
              <div class="package-details">
                <div>
                  <b-card>
                    <b-card-body v-if="selected" class="p-0">
                      <b-row>
                        <b-col sm="6">
                          <h4>
                            {{ selectedCategory.displayNames["en"] }} :
                            {{
                              selectedCategory.displayNames["ml"] ||
                              "ml not provided"
                            }}
                          </h4>
                          <br />
                          <div>priority: {{ selectedCategory.priority }}</div>
                        </b-col>
                        <b-col sm="6">
                          <b-img-lazy :src="selectedCategory.img" fluid rounded>
                          </b-img-lazy>
                        </b-col>
                      </b-row>
                      <b-row>
                        <p class="text-center">
                          Items in {{ selectedCategory.name }}.
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
      </template>
    </b-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data: function () {
    return { selectedCategory: null };
  },
  computed: {
    ...mapState({ categories: (state) => state.categories }),
    selected() {
      return this.selectedCategory ? true : false;
    },
  },
  beforeMount() {
    this.$store.dispatch("setCategories");
  },
  methods: {
    viewDetails(id) {
      this.selectedCategory = this.categories.find((item) => item.id == id);
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