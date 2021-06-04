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
                  <b-form-group label="Name of Item:" label-for="input-1">
                    <b-input-group id="input-1">
                      <b-form-input
                        required
                        placeholder="In English"
                        v-model.trim="form.name"
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
                      v-model.number="form.price"
                      id="input-2"
                      placeholder="Input price"
                    >
                    </b-form-input>
                  </b-form-group>
                </b-col>
              </b-row>
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
      form: { inStock: true },
      // validation: { img: true },
      imageData: null,
      imageURL: null,
      submitting: false,
      edit: false,
    };
  },
  computed: {
    ...mapState({ indiItems: (state) => state.indiItem.indiItems }),
  },
  mounted() {
    this.init();
  },
  methods: {
    createSearchArray(item) {
      const name = item.toLowerCase().trim();
      var arr = [];
      for (var i = 1; i <= name.length; i++) {
        arr.push(name.slice(0, i));
      }
      return arr;
    },
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
      if (this.form.id && this.edit) {
        indiRef = indipendentItemCollection.doc(this.form.id);
      } else {
        indiRef = indipendentItemCollection.doc();
      }
      var searchArray = this.createSearchArray(this.form.name);
      var item = {
        name: this.form.name,
        price: this.form.price,
        stock_quantity: this.form.inStock ? this.form.stock_quantity || 1 : 0,
        categories: this.form.categories || [],
        reqularPrice: this.form.price.toString(),
        salePrice: this.form.price.toString(),
        slug: this.form.name,
        searchArray: searchArray,
        tags: this.form.tags || [],
      };
      console.log(item);
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
      this.setUpdatedIndiItem(item);
      //
      this.submitting = false;
      this.$root.$bvToast.toast(`upload done`, {
        title: "Indipendent item",
        autoHideDelay: 5000,
      });
      this.$router.go(-1);
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
                slug: doc.get("slug"),
                categories: doc.get("categories"),
                stock_quantity: doc.get("stock_quantity"),
                price: doc.get("price"),
                regularPrice: doc.get("reqularPrice"),
                salePrice: doc.get("salePrice"),
                tags: doc.get("tags"),
              };
            });
          this.fetchData(item);
        }
      }
    },
    fetchData(item) {
      console.log(item);
      this.edit = true;
      var indiItem = JSON.parse(JSON.stringify(item));
      this.form.id = indiItem.id;
      this.form.name = indiItem.name;
      this.form.price = indiItem.price;
      this.form.categories = indiItem.categories;
      this.form.inStock = item.stock_quantity ? true : false;
      this.form.stock_quantity = item.stock_quantity;
      this.form.tags = item.tags;
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
  height: 100%;
  z-index: 10;
  background-color: rgba($color: #fff, $alpha: 0.5);
}
</style>