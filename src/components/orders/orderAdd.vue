<template>
  <b-card class="h-100 m-1">
    <template #header>
      <div class="d-flex justify-content-between">
        <h5>Create order</h5>
        <div>
          <b-overlay
            :show="submitting"
            rounded
            opacity="0.6"
            spinner-small
            spinner-variant="primary"
            class="d-inline-block"
          >
            <b-button pill form="order-form" type="submit" variant="success">
              Create
            </b-button>
          </b-overlay>
          <b-button class="ml-2" pill :disabled="submitting" @click="cancel">
            cancel
          </b-button>
        </div>
      </div>
    </template>
    <template #default>
      <b-form id="order-form" @submit.prevent="createOrder">
        <b-row no-gutters>
          <b-col md="6">
            <b-card no-body class="border-none">
              <template #header>
                <div
                  :class="{ 'text-danger': validation.user && !selectedUser }"
                >
                  Selected user:
                  {{
                    selectedUser
                      ? selectedUser.fullname
                      : "select a user from below"
                  }}
                </div>
              </template>
              <template #default>
                <div class="p-2">
                  <div class="d-flex p-2">
                    <div>search:</div>
                    <b-form-input
                      v-model.trim="searchValue"
                      size="sm"
                      class="ml-2"
                      placeholder="input id"
                    ></b-form-input>
                    <b-overlay :show="usersLoading">
                      <b-button size="sm" @click="search" variant="sucess">
                        go</b-button
                      ></b-overlay
                    >
                  </div>
                  <div style="height: 150px" class="w-100">
                    <b-list-group class="h-100 overflow-auto">
                      <b-list-group-item
                        v-for="item in searchValue ? searchUsers : users"
                        :button="
                          selectedUser ? selectedUser.id != item.id : true
                        "
                        :active="
                          selectedUser ? selectedUser.id == item.id : false
                        "
                        :key="item.id"
                        @click="userSelected(item)"
                      >
                        <div>id:{{ item.id }}</div>
                        {{ item.fullname }}{{ ": " }}{{ item.email }}
                      </b-list-group-item>
                      <b-list-group-item
                        button
                        v-if="!searchValue && userLast"
                        @click="loadMore"
                        class="text-center"
                      >
                        <b-overlay :show="usersLoading"> Load more</b-overlay>
                      </b-list-group-item>
                      <b-list-group-item class="text-center" v-else>
                        End
                      </b-list-group-item>
                    </b-list-group>
                  </div>
                </div>
              </template>
            </b-card>
          </b-col>
          <b-col class="px-2">
            <h6>Address:</h6>
            <b-form-group>
              <b-form-input
                class="mb-1"
                v-model="address.address1"
                required
                placeholder="address1"
              ></b-form-input>
              <b-form-input
                class="mb-1"
                v-model="address.address2"
                required
                placeholder="address2"
              ></b-form-input>
              <b-form-input
                class="mb-1"
                v-model="address.area"
                required
                placeholder="area"
              ></b-form-input>
              <b-form-input
                v-model="address.location"
                class="mb-1"
                required
                placeholder="location"
              ></b-form-input>
            </b-form-group>
            <b-row>
              <b-col sm="6">
                <b-form-group label="Price:" label-for="input-2">
                  <b-form-input
                    type="number"
                    min="0"
                    required
                    v-model.number="form.price"
                    id="input-2"
                    placeholder="Type price"
                  ></b-form-input> </b-form-group
              ></b-col>
              <b-col sm="6">
                <b-form-group label="Total:">
                  <b-form-input
                    type="number"
                    min="0"
                    :value="calculatedTotal"
                    disabled
                  ></b-form-input
                ></b-form-group> </b-col
            ></b-row>
          </b-col>
        </b-row>
        <b-row no-gutters>
          <b-col lg="6">
            <b-card no-body style="max-height: 500px">
              <b-card-header style="background-color: #6c757d">
                Items in this order
              </b-card-header>
              <b-list-group v-if="items.length" flush style="overflow: auto">
                <b-list-group-item
                  v-for="item in items"
                  :key="item.id"
                  class="py-1"
                >
                  <b-row align-v="center" align-h="between" class="m-0">
                    <b-col>
                      <b-row align-h="between">
                        <div>{{ item.name }}</div>
                        <div class="pl-4">{{ item.price }}Rs</div>
                      </b-row>
                    </b-col>
                    <b-col sm="auto">
                      <b-form-input
                        class="w-50"
                        type="number"
                        min="1"
                        v-model="item.quantity"
                        style="width: 60px; text-align: center"
                        @change="quantityChanged"
                      ></b-form-input>
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
                  <h6>Add items to this order.</h6>
                  <h6 class="text-danger" v-if="!validation.items">
                    Add atleast 1 item
                  </h6>
                </b-list-group-item>
              </b-list-group>
            </b-card>
          </b-col>
          <b-col lg="6">
            <indi-item-select :selectedItems="items" @addedItem="addItem" />
          </b-col>
        </b-row>
      </b-form>
    </template>
  </b-card>
</template>

<script>
import { mapState } from "vuex";
import IndiItemSelect from "../IndiItemSelect.vue";
export default {
  components: { IndiItemSelect },
  computed: {
    ...mapState({ searchUsers: (state) => state.users.searchUsers }),
    ...mapState({ users: (state) => state.users.users }),
    ...mapState({ searchUserLast: (state) => state.users.searchUserLast }),
    ...mapState({ userLast: (state) => state.users.userLast }),
    ...mapState({ usersLoading: (state) => state.users.usersLoading }),
    ...mapState({ areas: (state) => state.settings.areas }),
    ...mapState({ areaLoading: (state) => state.settings.areaLoading }),
    ...mapState({
      locationsLoading: (state) => state.settings.locationsLoading,
    }),
    ...mapState({ datLocations: (state) => state.settings.locations }),
    ...mapState({ areaImages: (state) => state.settings.areaImages }),
  },
  data() {
    return {
      submitting: false,
      searchValue: null,
      selectedUser: null,
      address: {},
      // areaOptions: [],
      form: {},
      validation: {
        items: true,
        user: true,
      },
      items: [],
      calculatedTotal: 0,
    };
  },
  methods: {
    userSelected(item) {
      this.selectedUser = item;
      if (item.address) {
        var temp;
        temp = {
          address1: item.address.address1,
          address2: item.address.address2,
          mobile: item.address.mobile,
        };
        this.address = temp;
      } else {
        this.address = {};
      }
    },
    loadMore() {
      this.$store.dispatch("getUsers");
    },
    cancel() {
      this.$router.go(-1);
    },
    search() {
      this.$store.dispatch("getSearchUsers", {
        single: true,
        value: this.searchValue,
      });
    },
    quantityChanged() {
      this.calculateTotal();
    },
    calculateTotal() {
      this.calculatedTotal = 0;
      this.items.forEach((item) => {
        this.calculatedTotal += parseInt(item.quantity) * parseInt(item.price);
      });
    },
    addItem(item) {
      item.quantity = 1;
      let obj = this.items.find((x) => x.id == item.id);
      if (!obj) {
        this.items.push(item);
      }
    },
    //
    createOrder() {
      // verification
      let needVerification = false;
      // items validation
      if (this.items.length == 0) {
        this.validation.items = false;
        needVerification = true;
      } else {
        this.validation.items = true;
      }
      if (this.selectedUser == null) {
        this.validation.user = false;
        needVerification = true;
      } else {
        this.validation.user = true;
      }
      if (needVerification) {
        return true;
      }
      // after verification'
      this.form.items = [];
      this.items.forEach((item) => {
        this.form.items.push({
          itemId: item.id,
          itemName: item.name,
          product_id: item.id,
          quantity: item.quantity,
          total: item.quantity * item.price,
          unitPrice: item.price,
          picture:
            "https://firebasestorage.googleapis.com/v0/b/freshgrown-b1de6.appspot.com/o/Defaults%2Fdefault_profile_thumb.png?alt=media&token=7bff14ab-34a5-4ab8-b484-165f421beff8",
        });
      });
      console.log(this.form.items);
    },
  },
  mounted() {
    this.$store.dispatch("getSettingsAreas");
  },
  watch: {
    items: function () {
      this.calculateTotal();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>