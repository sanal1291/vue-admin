<template>
  <b-card no-body>
    <b-card-header class="p-2" style="background-color: #6c757d">
      <div class="d-flex align-items-center justify-content-between">
        <div>All items</div>
        <b-nav-form class="navbar-item" @submit.prevent="">
          <b-form-input size="sm" class="mr-sm-2" placeholder="Search">
          </b-form-input>
          <b-button size="sm" class="my-2 my-sm-0" type="submit">
            Search
          </b-button>
        </b-nav-form>
      </div>
    </b-card-header>

    <b-list-group v-if="items">
      <b-list-group-item> Loading </b-list-group-item>
    </b-list-group>
    <b-list-group v-else-if="items.length" flush>
      <b-list-group-item v-for="item in items" :key="item.id" class="py-1">
        <b-row align-v="center" align-h="between" class="m-0">
          <b-col>
            <b-row>
              <div>
                {{ item.name }}
              </div>
              <div class="pl-4">
                {{ item.price }}
              </div>
            </b-row>
          </b-col>
          <b-col sm="1">
            <b-button size="sm" @click="deleteItem(item)">
              <b-icon icon="trash"></b-icon
            ></b-button>
          </b-col>
        </b-row>
      </b-list-group-item>
    </b-list-group>
    <b-list-group v-else>
      <b-list-group-item>
        <h6>Add items to this package.</h6>
        <h6 class="text-danger" v-if="!validation.items">Add atleast 1 item</h6>
      </b-list-group-item>
    </b-list-group>
  </b-card>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: ["selectedItems"],
  computed: {
    ...mapState({ items: (state) => state.indiItem.items }),
    ...mapState({ searchItems: (state) => state.indiItem.searchItems }),
  },
  mounted() {
    this.$store.dispatch("getItems");
  },
  watch: {
    selectedItem() {
      console.log("hi");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>