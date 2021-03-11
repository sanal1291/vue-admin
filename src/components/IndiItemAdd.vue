<template>
  <div class="overlay">
    <b-container>
      <b-row align-h="center" align-v="center">
        <b-card style="min-width: 60%">
          <b-card-title>
            <b-row>
              <b-col cols="auto">
                <b-button @click="close"
                  ><b-icon icon="arrow-left"></b-icon
                ></b-button>
              </b-col>
              <b-col v-if="edit"> Edit {{ form.name }} {{ form.id }}</b-col>
              <b-col v-else>Create a Indipendent item.</b-col>
            </b-row>
          </b-card-title>
          <b-card-text>
            <b-form @submit.prevent="create">
              <b-row>
                <b-col>
                  <b-form-group label="Name of Category:" label-for="input-1">
                    <b-input-group id="input-1" prepend="EN">
                      <b-form-input
                        required
                        placeholder="In English"
                        v-model.trim="form.displayNames['en']"
                      ></b-form-input>
                    </b-input-group>
                    <b-input-group class="pt-3" id="input-1" prepend="ML">
                      <b-form-input
                        placeholder="In malayalam"
                        v-model.trim="form.displayNames['ml']"
                      ></b-form-input>
                    </b-input-group>
                  </b-form-group>
                </b-col>
                <b-col cols="auto">
                  <b-form-group label="In stock :" label-for="input-4">
                    <b-form-checkbox v-model="form.inStock" switch>
                      <div v-if="form.inStock" class="">In stock.</div>
                      <div v-else class="text-danger">Out of stock.</div>
                    </b-form-checkbox>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <b-form-group label="Price :" input-for="input-2">
                    <b-form-input
                      type="number"
                      required
                      v-model="form.price"
                      id="input-2"
                      placeholder="Input price"
                    >
                    </b-form-input>
                  </b-form-group>
                </b-col>
                <b-col>
                  <b-form-group label="Unit :" input-for="input-3">
                    <b-form-input
                      required
                      v-model="form.unitMeasured"
                      id="input-3"
                      placeholder="Input Unit"
                    >
                    </b-form-input>
                  </b-form-group>
                </b-col>
                <b-col>
                  <b-form-group label="Priority :" label-for="input-5">
                    <b-form-input
                      type="number"
                      v-model="form.rank"
                      id="input-5"
                      placeholder="Input priority"
                    >
                    </b-form-input>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-form-group label="Category image:" label-for="input-3">
                <!-- <div class="text-danger" v-if="!validation.img">
                  Select image.
                </div> -->
                <img style="max-height: 200px" class="pb-2" :src="imageURL" />
                <div class="w-100">
                  <b-form-file
                    style="width: auto"
                    type="file"
                    accept="image/*"
                    placeholder="Select image"
                    @change="onFileChange"
                  ></b-form-file>
                </div>
              </b-form-group>
              <b-row align-h="around">
                <b-col cols="auto" v-if="edit">
                  <b-overlay
                    :show="submitting"
                    rounded
                    opacity="0.6"
                    spinner-small
                    spinner-variant="primary"
                    class="d-inline-block"
                  >
                    <b-button variant="danger" @click="deleteCat">
                      Delete
                    </b-button>
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
                    <b-button variant="success" type="submit">
                      Submit
                    </b-button>
                  </b-overlay>
                </b-col>
              </b-row>
            </b-form>
          </b-card-text>
        </b-card></b-row
      ></b-container
    >
  </div>
</template>

<script>
import { mapState } from "vuex";
import { indipendentItemCollection, storage } from "../firebase";
export default {
  data: () => {
    return {
      form: { displayNames: {}, inStock: true, rank: 2 },
      // validation: { img: true },
      imageData: null,
      imageURL: null,
      submitting: false,
      edit: false,
    };
  },
  computed: {
    ...mapState({ indiItems: (state) => state.indiItems }),
  },
  mounted() {
    this.init();
  },
  methods: {
    async create() {
      this.submitting = true;
      // if (!this.imageData && !this.edit) {
      //   this.validation.img = false;
      //   this.submitting = false;
      //   return true;
      // } else {
      //   this.validation.img = true;
      // }
      // this.submitting = true;
      var indiRef;
      this.form.imageUrl = await this.uploadImage();
      if (this.form.id && this.edit) {
        indiRef = indipendentItemCollection.doc(this.form.id);
      } else {
        indiRef = indipendentItemCollection.doc();
      }
      var item = {
        displayName: {
          en: this.form.displayNames["en"],
          ml: this.form.displayNames["ml"],
        },
        name: this.form.displayNames["en"],
        imageUrl: this.form.imageUrl,
        rank: this.form.rank,
        price: this.form.price,
        inStock: this.form.inStock,
        unitMeasured: this.form.unitMeasured,
      };
      try {
        await indiRef.set(item);
      } catch (error) {
        console.log(error);
        this.$root.$bvToast.toast(error, {
          title: "Indipendent item",
          autoHideDelay: 5000,
        });
        this.$router.go(-1);
        return;
      }
      // adding the updated value to state
      item.id = indiRef.id;
      item.displayNames = item.displayName;
      this.setUpdatedIndiItem(item);
      //
      this.submitting = false;
      this.$root.$bvToast.toast(`upload done`, {
        title: "Indipendent item",
        autoHideDelay: 5000,
      });
      this.$router.go(-1);
    },
    async uploadImage() {
      if (this.imageData) {
        var storageRef = storage.child(
          "indiItem_images/" + +new Date() + this.imageData["name"]
        );
        var snapshot = await storageRef.put(this.imageData);
        return await snapshot.ref.getDownloadURL();
      } else {
        return this.form.img;
      }
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
      if (this.$route.query.edit) {
        if (this.$route.query.indiItem.id != undefined) {
          // if indiitem is passes
          this.fetchData(this.$route.query.indiItem);
        } else {
          // fetch indiItem
          var item = await indipendentItemCollection
            .doc(this.$route.query.indiItemId)
            .get()
            .then((doc) => {
              return {
                id: doc.id,
                name: doc.get("name"),
                displayNames: doc.get("displayName"),
                category: doc.get("category"),
                imageUrl: doc.get("imageUrl"),
                inStock: doc.get("inStock"),
                price: doc.get("price"),
                rank: doc.get("rank"),
                unitMeasured: doc.get("unitMeasured"),
              };
            });
          this.fetchData(item);
        }
      }
    },
    fetchData(item) {
      this.edit = true;
      var indiItem = JSON.parse(JSON.stringify(item));
      this.form.id = indiItem.id;
      this.form.name = indiItem.name;
      this.form.displayNames = indiItem.displayNames;
      this.form.inStock = indiItem.inStock;
      this.form.price = indiItem.price;
      this.form.unitMeasured = indiItem.unitMeasured;
      this.form.rank = indiItem.rank;
      this.form.imageUrl = indiItem.imageUrl;
      this.imageURL = indiItem.imageUrl;
    },
    setUpdatedIndiItem(item) {
      var index = this.indiItems.findIndex((indi) => indi.id === item.id);
      if (index >= 0) {
        this.indiItems[index] = item;
      }
    },

    close() {
      this.$router.go(-1);
    },
    deleteCat() {
      var response = window.confirm("Are you sure?");
      if (response) {
        indipendentItemCollection
          .doc(this.form.id)
          .delete()
          .then(() => {
            this.$root.$bvToast.toast("Deleted", {
              title: "Indipendent Item",
              autoHideDelay: 5000,
            });
            this.setDeletedIndiItem(this.form.id);
          });

        this.$router.go(-1);
      } else {
        console.log(response);
      }
    },
    setDeletedIndiItem(id) {
      var index = this.indiItems.findIndex((indi) => indi.id === id);
      console.log(index);
      if (index >= 0) {
        this.indiItems.splice(index, 1);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.overlay {
  position: absolute;
  width: 100%;
  z-index: 10;
  background-color: rgba($color: #fff, $alpha: 0.5);
}
</style>