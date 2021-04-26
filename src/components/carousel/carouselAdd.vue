<template>
  <div>
    <div class="pl-3">
      <h4 v-if="edit">Edit {{ selectedCarousel.displayNames["en"] }}</h4>
      <h4 v-else>Create new carousel.</h4>
    </div>
    <b-form @submit.prevent="createCarousel" class="p-3">
      <b-row>
        <b-col md="6">
          <b-form-group label="Name of carousel:" label-for="input-1">
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
          </b-form-group>
          <b-form-group label="Select to where the carousel points to.">
            <b-form-radio-group
              v-model="form.isPackage"
              button-variant="outline-success"
              buttons
              :options="options"
              @change="targetChange"
            >
            </b-form-radio-group>
          </b-form-group>
        </b-col>
        <b-col class="flex-nowrap">
          <b-form-group label="carousel image:" label-for="input-3">
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
      <h6 v-if="form.isPackage">Carousel target packages</h6>
      <h6 v-if="!form.isPackage">Carousel target Items</h6>
      <b-row no-gutters>
        <b-col lg="6">
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
                      <div>{{ item.name }}</div>
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
          <package-select
            v-show="form.isPackage"
            :selectedItems="items"
            @addedItem="addItem"
          />
          <item-select
            v-show="!form.isPackage"
            :selectedItems="items"
            @addedItem="addItem"
          />
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
            <b-button @click="deleteCarousel" variant="danger">
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
import { mapState } from "vuex";
import {
  carouselCollection,
  ItemCollection,
  packageCollection,
  storage,
} from "../../firebase";
import itemSelect from "./itemSelect.vue";
import PackageSelect from "./packageSelect.vue";
export default {
  components: { itemSelect, PackageSelect },
  computed: { ...mapState({ carousels: (state) => state.carousel.carousels }) },
  data() {
    return {
      edit: false,
      imageURL: "",
      items: [],
      submitting: false,
      selectedCarousel: null,
      options: [
        { text: "Item", value: false },
        { text: "Package", value: true },
      ],
      form: {
        displayNames: {},
        isPackage: false,
      },
      validation: {
        img: true,
        target: true,
        items: true,
      },
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    addItem(item) {
      console.log(item);
      let obj = this.items.find((x) => x.id == item.id);
      if (!obj) {
        this.items.push(item);
      }
    },
    deleteItem(item) {
      this.items = this.items.filter((e) => e.id != item.id);
    },
    deleteCarousel() {
      var response = window.confirm("Are you sure?");
      if (response) {
        carouselCollection
          .doc(this.selectedCarousel.id)
          .delete()
          .then(() => {
            this.$root.$bvToast.toast("Deleted", {
              title: "Carousel",
              autoHideDelay: 5000,
            });
          });
        this.$router.go(-1);
      } else {
        console.log(response);
      }
    },
    cancel() {
      this.$router.go(-1);
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
    targetChange(e) {
      this.items = [];
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
    async createCarousel() {
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
      var carouselRef;
      this.form.img = await this.uploadImage();
      this.form.items = [];
      if (this.items) {
        this.items.forEach((item) => {
          this.form.items.push(item.id);
        });
      }
      if (this.form.id && this.edit) {
        carouselRef = carouselCollection.doc(this.form.id);
      } else {
        carouselRef = carouselCollection.doc();
      }
      var searchArray = this.createSearchArray(this.form.displayNames);
      await carouselRef.set({
        items: this.form.items,
        image: this.form.img,
        displayNames: this.form.displayNames,
        isPackage: this.form.isPackage,
        searchArray: searchArray,
      });

      this.submitting = false;
      this.$root.$bvToast.toast(`upload done`, {
        title: "Carousel",
        autoHideDelay: 5000,
      });
      this.$router.go(-1);
    },
    createSearchArray(value) {
      var arr = [];
      Object.values(value).forEach((name) => {
        for (var i = 1; i <= name.length; i++) {
          arr.push(name.slice(0, i).toLowerCase());
        }
      });
      return arr;
    },
    fetchData() {
      this.edit = this.$route.query.edit;
      if (this.edit) {
        let arr = [];
        this.selectedCarousel = this.carousels.find(
          (item) => item.id == this.$route.query.carousel
        );
        this.form.id = this.selectedCarousel.id;
        this.form.displayNames = this.selectedCarousel.displayNames;
        this.form.isPackage = this.selectedCarousel.isPackage;
        this.imageURL = this.selectedCarousel.image;
        this.form.img = this.selectedCarousel.image;
        arr = [];
        this.selectedCarousel.items.forEach((element) => {
          if (this.selectedCarousel.isPackage) {
            packageCollection
              .doc(element)
              .get()
              .then((doc) => {
                arr.push({ id: doc.id, name: doc.get("displayNames")["en"] });
              });
          } else {
            ItemCollection.doc(element)
              .get()
              .then((doc) => {
                arr.push({ id: doc.id, name: doc.get("displayName")["en"] });
              });
          }
        });
        this.items = arr;
      } else {
        return;
      }
    },
  },
  watch: {
    carousels() {
      if (!this.selectedCarousel) {
        this.fetchData();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>