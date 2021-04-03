<template>
  <div>
    <b-row no-gutters class="text-center">
      <b-col md="6">
        <h4 v-if="edit">Edit {{ selectedItem.name }}</h4>
        <h4 v-else>Create new Item Group.</h4>
      </b-col>
    </b-row>
    <b-form @submit.prevent="createItem" class="p-3">
      <b-row>
        <b-col md="6">
          <b-form-group label="Name of Item Group:" label-for="input-1">
            <b-row no-gutters>
              <b-col>
                <b-input-group prepend="EN">
                  <b-form-input
                    required
                    placeholder="In english"
                    v-model.trim="form.displayName['en']"
                  >
                  </b-form-input>
                </b-input-group>
              </b-col>
              <b-col>
                <b-input-group prepend="ML">
                  <b-form-input
                    required
                    placeholder="In Malayalam"
                    v-model.trim="form.displayName['ml']"
                  >
                  </b-form-input>
                </b-input-group>
              </b-col>
            </b-row>
          </b-form-group>
          <b-form-group label="Select categories:" v-slot="{ ariaDescribedby }">
            <div class="text-danger" v-if="!validation.category">
              Select atleast 1 catergory
            </div>
            <b-form-checkbox-group
              size="md"
              id="checkbox-group-1"
              v-model="selectedCategories"
              :options="categories"
              :aria-describedby="ariaDescribedby"
              name="flavour-1"
            ></b-form-checkbox-group>
          </b-form-group>
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
      <b-row no-gutters>
        <b-col lg="6" class="pr-2">
          <b-card no-body style="max-height: 500px">
            <b-card-header style="background-color: #6c757d">
              Items in this group
            </b-card-header>
            <b-list-group v-if="items.length" flush style="overflow: auto">
              <b-list-group-item
                v-for="item in items"
                :key="item.id"
                class="py-1"
              >
                <b-row align-v="center" align-h="between" class="m-0">
                  <b-col>
                    <b-row>
                      <div>
                        {{ item.name }}
                      </div>
                      <div class="pl-4">{{ item.price }}Rs</div>
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
      <br />
      <b-row align-h="center">
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
            <b-button type="button" @click="deletePack" variant="danger">
              Delete</b-button
            >
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
            <b-button variant="success" type="submit"> Submit</b-button>
          </b-overlay>
        </b-col>
      </b-row>
    </b-form>
  </div>
</template>




<script>
import {
  categoryCollection,
  indipendentItemCollection,
  ItemCollection,
  packageCollection,
} from "../firebase";
import { storage } from "../firebase";
import IndiItemSelect from "./IndiItemSelect.vue";
export default {
  components: { IndiItemSelect },
  data: function () {
    return {
      validation: {
        img: true,
        items: true,
        category: true,
      },
      edit: null,
      selectedItem: undefined,
      imageURL: "",
      imageData: null,
      form: { displayName: {} },
      items: [],
      submitting: false,
      categories: [],
      selectedCategories: [],
    };
  },
  created: function () {
    this.init();
  },
  computed: {
    availableOptions() {
      return this.categories.filter(
        (opt) => this.selectedCategories.indexOf(opt) === -1
      );
    },
  },
  methods: {
    cancel() {
      this.$router.go(-1);
    },
    deleteItem(item) {
      this.items = this.items.filter((e) => e.id != item.id);
    },
    addItem(item) {
      let obj = this.items.find((x) => x.id == item.id);
      if (!obj) {
        this.items.push(item);
      }
    },
    async uploadImage() {
      if (this.imageData) {
        var storageRef = storage.child(
          "packages/" + +new Date() + this.imageData["name"]
        );
        var snapshot = await storageRef.put(this.imageData);
        return await snapshot.ref.getDownloadURL();
      } else {
        return this.form.imageUrl;
      }
    },
    async createItem() {
      console.log("create");
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
      // category validation
      if (!this.selectedCategories.length) {
        this.validation.category = false;
        needVerification = true;
      } else {
        this.validation.category = true;
      }
      if (needVerification) {
        return true;
      }
      // after verification
      this.submitting = true;
      var itemRef;
      this.form.imageUrl = await this.uploadImage();
      // setting items
      this.form.items = [];
      if (this.items) {
        this.items.forEach((item) => {
          this.form.items.push({
            itemId: item.id,
          });
        });
      }
      // setting categories
      this.form.categories = this.selectedCategories;
      // uploading
      if (this.form.id && this.edit) {
        itemRef = ItemCollection.doc(this.form.id);
      } else {
        itemRef = ItemCollection.doc();
      }
      var searchArray = this.createSearchArray(this.form.displayName);
      await itemRef.set({
        varieties: this.form.items,
        imageUrl: this.form.imageUrl,
        name: this.form.displayName["en"],
        displayName: this.form.displayName,
        searchArray: searchArray,
        category: this.form.categories,
      });
      this.submitting = false;
      this.$root.$bvToast.toast(`upload done`, {
        title: "Item groups",
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
      console.log(this.selectedItem.id);
      var response = window.confirm("Are you sure?");
      if (response) {
        console.log(response);
        ItemCollection.doc(this.selectedItem.id)
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

    async init() {
      categoryCollection.get().then((categories) => {
        this.categories = [];
        categories.forEach((doc) => {
          this.categories.push({
            value: doc.id,
            text: doc.get("displayNames")["en"],
          });
        });
      });
      if (this.$route.query.edit) {
        if (this.$route.query.groupItem.id != undefined) {
          // if indiitem is passes
          this.fetchData(this.$route.query.groupItem);
        } else {
          // fetch indiItem
          var item = await ItemCollection.doc(this.$route.query.groupItemId)
            .get()
            .then((doc) => {
              return {
                id: doc.id,
                name: doc.get("name"),
                displayName: doc.get("displayName"),
                category: doc.get("category"),
                varieties: doc.get("varieties"),
                imageUrl: doc.get("imageUrl"),
                rank: doc.get("rank"),
              };
            });
          this.fetchData(item);
        }
      }
    },
    fetchData(item) {
      let arr = [];
      this.edit = this.$route.query.edit;
      this.selectedItem = item;
      if (this.edit) {
        this.form.id = this.selectedItem.id;
        this.form.name = this.selectedItem.name;
        this.form.displayName = this.selectedItem.displayName;
        this.form.imageUrl = this.selectedItem.imageUrl;
        this.imageURL = this.selectedItem.imageUrl;
        this.selectedCategories = this.selectedItem.category;
        // fetching items
        this.selectedItem.varieties.forEach((e) => {
          arr = [];
          indipendentItemCollection
            .doc(e.itemId)
            .get()
            .then((doc) => {
              arr.push({
                id: doc.id,
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
};
</script>

<style lang="scss" scoped>
</style>