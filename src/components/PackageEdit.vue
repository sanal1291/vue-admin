<template>
  <div>
    <b-row v-if="loading && !packages.length">loading</b-row>
    <b-row v-else-if="!loading" no-gutters class="text-center">
      <b-col md="6">
        <h4 v-if="edit">Edit {{ selectedPackage.name }}</h4>
        <h4 v-else>Create new package.</h4>
      </b-col>
    </b-row>
    <b-form @submit.prevent="createPackage" class="p-3">
      <b-row>
        <b-col md="6">
          <b-form-group label="Name of package:" label-for="input-1">
            <b-form-input
              required
              v-model="form.name"
              id="input-1"
              placeholder="Input name"
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
        <b-col lg="6">
          <b-list-group v-if="items.length">
            <b-list-group-item
              v-for="item in items"
              :key="item.id"
              class="py-1"
            >
              <b-row align-v="center" align-h="between" class="m-0">
                <b-col>
                  <b-row>
                    <div>{{ item.displayName["en"] }}</div>
                    <div class="pl-4">
                      {{ item.price }}Rs per {{ item.unit }}
                    </div>
                  </b-row>
                </b-col>
                <b-col sm="auto">
                  <!-- <b-row class="h3 m-0"> -->
                  <!-- <b-button size="sm">
                      <b-icon icon="arrow-up" @click="item.quantity++"></b-icon
                    ></b-button> -->
                  <b-form-input
                    class="w-50"
                    type="number"
                    min="1"
                    v-model="item.quantity"
                    style="width: 60px; text-align: center"
                  ></b-form-input>
                  <!-- <b-button size="sm">
                      <b-icon
                        icon="arrow-down"
                        @click="item.quantity--"
                      ></b-icon
                    ></b-button> -->
                  <!-- </b-row> -->
                </b-col>
                <b-col sm="2">
                  <span>Price:{{ item.quantity * item.price }}</span>
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
              <h6 class="text-danger" v-if="!validation.items">
                Add atleast 1 item
              </h6>
            </b-list-group-item>
          </b-list-group>
        </b-col>
        <b-col>All items:</b-col>
        <b-col lg="6"> </b-col>
      </b-row>
      <br />
      <b-row align-h="center">
        <b-col cols="3"><b-button @click="cancel">cancel</b-button></b-col>
        <b-col cols="1"><br /></b-col>
        <b-col cols="3">
          <b-overlay
            :show="submitting"
            rounded
            opacity="0.6"
            spinner-small
            spinner-variant="primary"
            class="d-inline-block"
          >
            <b-button variant="success" type="submit"> Submit</b-button>
          </b-overlay>
        </b-col>
      </b-row>
    </b-form>
  </div>
</template>




<script>
import { mapState } from "vuex";
import { indipendentItemCollection, packageCollection } from "../firebase";
import { storage } from "../firebase";
export default {
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
      form: {},
      items: [],
      calculatedTotal: 0,
      submitting: false,
      test: true,
    };
  },
  created: function () {
    this.init();
    // this.storageRef = storage.ref('')
  },
  computed: {
    ...mapState({ packages: (state) => state.packages }),
  },
  methods: {
    cancel() {
      this.$router.push({ name: "Package" });
    },
    deleteItem(item) {
      this.items = this.items.filter((e) => e.id != item.id);
    },
    async uploadImage() {
      if (this.imageData) {
        var storageRef = storage.child(
          "packages/" + +new Date() + this.imageData["name"]
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
      await packageRef.set({
        items: this.form.items,
        image: this.form.img,
        name: this.form.name,
        price: parseInt(this.form.price),
        total: parseInt(this.form.total),
      });
      this.submitting = false;
      this.$bvToast.toast(`upload done`, {
        title: "Package",
        autoHideDelay: 2000,
      });
      this.$router.push({ name: "Package" });
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
    async init() {
      await this.$store.dispatch("setPackages").then(() => {
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
                displayName: doc.get("displayName"),
                img: doc.get("imageUrl"),
                category: doc.get("category"),
                price: doc.get("price"),
                unit: doc.get("unitMeasured"),
                inStock: doc.get("inStock"),
                quantity: e.quantity,
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
      this.calculatedTotal = 0;
      this.items.forEach((item) => {
        this.calculatedTotal += parseInt(item.quantity) * parseInt(item.price);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>