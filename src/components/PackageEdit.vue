<template>
  <b-card class="h-100">
    <template #header>
      <div class="between-center-flex-md">
        <div v-if="loading && !packages.length">loading</div>
        <div v-else-if="!loading">
          <h4 v-if="edit">Edit {{ selectedPackage.name }}</h4>
          <h4 v-else>Create new package.</h4>
        </div>
        <b-row class="flex-nowrap">
          <b-col cols="auto">
            <b-button :disabled="submitting" @click="cancel"> cancel </b-button>
          </b-col>
          <b-col cols="auto" v-if="edit">
            <b-overlay
              :show="submitting"
              rounded
              opacity="0.6"
              spinner-small
              spinner-variant="primary"
              class="d-inline-block"
            >
              <b-button @click="deletePack" variant="danger"> Delete</b-button>
            </b-overlay>
          </b-col>
          <b-col cols="auto">
            <b-overlay
              :show="submitting"
              rounded
              opacity="0.6"
              spinner-small
              spinner-variant="primary"
              class="d-inline-block"
            >
              <b-button variant="success" form="package-form" type="submit">
                Submit</b-button
              >
            </b-overlay>
          </b-col>
        </b-row>
      </div>
    </template>
    <b-form @submit.prevent="createPackage" id="package-form">
      <b-row>
        <b-col md="6">
          <b-form-group label="Name of package:" label-for="input-1">
            <b-input-group prepend="EN">
              <b-form-input
                required
                placeholder="In english"
                v-model.trim="form.displayNames['en']"
              >
              </b-form-input>
            </b-input-group>
            <b-input-group prepend="ML" class="pt-3">
              <b-form-input
                required
                placeholder="In Malayalam"
                v-model.trim="form.displayNames['ml']"
              >
              </b-form-input>
            </b-input-group>
            <!-- <b-form-input
              required
              v-model="form.name"
              id="input-1"
              placeholder="Input name"
            ></b-form-input> -->
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
        <b-col class="flex-nowrap">
          <b-form-group label="Package image:" label-for="input-3">
            <div class="text-danger" v-if="!validation.img">Select image.</div>
            <img style="max-height: 200px" class="pb-2" :src="imageURL" />
            <div class="w-100">
              <b-form-file
                style="width: auto"
                type="file"
                accept="image/*"
                id="input-3"
                placeholder="Select image"
                @change="onFileChange"
              ></b-form-file>
            </div>
          </b-form-group>
        </b-col>
      </b-row>
      <h6>Items in package</h6>
      <b-row no-gutters>
        <b-col lg="6" class="pr-lg-2">
          <b-card no-body style="max-height: 500px">
            <b-card-header style="background-color: #6c757d">
              Items in this package
            </b-card-header>
            <b-list-group v-if="items.length" flush style="overflow: auto">
              <b-list-group-item
                v-for="item in items"
                :key="item.id"
                class="py-1"
              >
                <b-row no-gutters align-v="center" class="m-0 p-1">
                  <b-col lg="6" sm="12">
                    <div>
                      <div>{{ item.name }}</div>
                      <div class="pl-4">{{ item.price }}Rs</div>
                    </div>
                  </b-col>
                  <b-col lg="4" cols="8" class="d-flex justify-content-center">
                    <b-form-input
                      class="w-50"
                      type="number"
                      min="1"
                      v-model="item.quantity"
                      style="width: 60px; text-align: center"
                      @change="quantityChanged"
                    ></b-form-input>
                  </b-col>
                  <b-col lg="2" cols="4">
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
                <h6 class="text-danger" v-if="!validation.items">
                  Add atleast 1 item
                </h6>
              </b-list-group-item>
            </b-list-group>
          </b-card>
        </b-col>
        <b-col lg="6" class="pt-2 pt-lg-0" style="max-height: 500px">
          <indi-item-select :selectedItems="items" @addedItem="addItem" />
        </b-col>
      </b-row>
    </b-form>
  </b-card>
</template>




<script>
import { mapState } from "vuex";
import { indipendentItemCollection, packageCollection } from "../firebase";
import { storage } from "../firebase";
import IndiItemSelect from "./IndiItemSelect.vue";
export default {
  components: {
    IndiItemSelect,
  },
  data: function () {
    return {
      validation: {
        img: true,
        items: true,
      },
      edit: null,
      selectedPackage: undefined,
      imageURL: "",
      imageData: null,
      loading: true,
      form: { displayNames: {} },
      items: [],
      calculatedTotal: 0,
      submitting: false,
      test: true,
    };
  },
  created: function () {
    this.init();
  },
  computed: {
    ...mapState({ packages: (state) => state.packages }),
  },
  methods: {
    cancel() {
      this.$router.go(-1);
    },
    deleteItem(item) {
      this.items = this.items.filter((e) => e.id != item.id);
    },
    addItem(item) {
      item.quantity = 1;
      let obj = this.items.find((x) => x.id == item.id);
      if (!obj) {
        this.items.push(item);
      }
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
    async uploadImage() {
      if (this.imageData) {
        var storageRef = storage.child(
          "packages/" + this.form.displayNames["en"] + new Date().toISOString()
        );
        var snapshot = await storageRef.put(this.imageData);
        return await snapshot.ref.getDownloadURL();
      } else {
        return this.form.img;
      }
    },
    async createPackage() {
      // verification
      let needVerification = false;
      // items validation
      if (this.items.length == 0) {
        this.validation.items = false;
        needVerification = true;
      } else {
        this.validation.items = true;
      }
      // img validation
      if (!this.edit && !this.imageData) {
        this.validation.img = false;
        needVerification = true;
      } else {
        this.validation.img = true;
      }
      if (needVerification) {
        return true;
      }
      // after verification
      this.submitting = true;
      var packageRef;
      this.form.img = await this.uploadImage();

      this.form.items = [];
      if (this.items) {
        this.items.forEach((item) => {
          this.form.items.push({
            item: item.id,
            quantity: parseInt(item.quantity),
          });
        });
      }
      if (this.form.id && this.edit) {
        packageRef = packageCollection.doc(this.form.id);
      } else {
        packageRef = packageCollection.doc();
      }
      var searchArray = this.createSearchArray(this.form.displayNames);
      await packageRef.set({
        items: this.form.items,
        image: this.form.img,
        name: this.form.displayNames["en"],
        displayNames: this.form.displayNames,
        price: parseInt(this.form.price),
        total: parseInt(this.calculatedTotal),
        searchArray: searchArray,
      });
      this.submitting = false;
      this.$root.$bvToast.toast(`upload done`, {
        title: "Package",
        autoHideDelay: 5000,
      });
      this.$router.go(-1);
    },

    createSearchArray(value) {
      var arr = [];
      Object.values(value).forEach((name) => {
        for (var i = 1; i <= name.length; i++) {
          arr.push(name.trim().slice(0, i).toLowerCase());
        }
      });
      return arr;
    },

    onFileChange(e) {
      var input = e.target;
      this.imageData = e.target.files[0];
      if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = (e) => {
          this.imageURL = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
      }
    },
    deletePack() {
      console.log(this.selectedPackage.id);
      var response = window.confirm("Are you sure?");
      if (response) {
        console.log(response);
        packageCollection
          .doc(this.selectedPackage.id)
          .delete()
          .then(() => {
            this.$root.$bvToast.toast("Deleted", {
              title: "Package",
              autoHideDelay: 5000,
            });
          });
        this.$router.go(-1);
      } else {
        console.log(response);
      }
    },

    init() {
      this.$store.dispatch("setPackages").then(() => {
        this.selectedPackage = this.packages.find(
          (item) => item.id == this.$route.query.package
        );

        if (this.selectedPackage != undefined) {
          this.fetchData();
        }
        this.loading = false;
      });
    },
    fetchData() {
      let arr = [];
      this.edit = this.$route.query.edit;

      this.selectedPackage = this.packages.find(
        (item) => item.id == this.$route.query.package
      );
      if (this.edit) {
        this.form.id = this.selectedPackage.id;
        this.form.name = this.selectedPackage.name;
        this.form.displayNames = this.selectedPackage.displayNames;
        this.form.img = this.selectedPackage.img;
        this.form.price = this.selectedPackage.price;
        this.form.total = this.selectedPackage.total;
        this.imageURL = this.selectedPackage.img;
        // fetching items
        this.selectedPackage.items.forEach((e) => {
          arr = [];
          indipendentItemCollection
            .doc(e.item)
            .get()
            .then((doc) => {
              arr.push({
                id: doc.id,
                quantity: e.quantity,
                name: doc.get("name"),
                price: doc.get("price"),
                stock_quantity: doc.get("stock_quantity"),
              });
            });
        });
        this.items = arr;
      }
    },
  },
  watch: {
    packages: function () {
      this.fetchData();
    },
    items: function () {
      this.calculateTotal();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>