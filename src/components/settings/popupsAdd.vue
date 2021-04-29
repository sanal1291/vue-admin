<template>
  <div class="overlay">
    <b-overlay :show="loadingAdmin">
      <b-container>
        <b-row align-h="center" align-v="center">
          <b-card style="min-width: 50%">
            <b-card-title>
              <b-row>
                <b-col cols="auto">
                  <b-button @click="close"
                    ><b-icon icon="arrow-left"></b-icon
                  ></b-button>
                </b-col>
                <b-col v-if="edit"> Edit popup</b-col>
                <b-col v-else>Create a popup</b-col>
              </b-row>
            </b-card-title>
            <b-card-text>
              <b-form @submit.prevent="create">
                <b-form-group label="Enter message:" label-for="input-1">
                  <b-input-group class="pt-3" id="input-1" prepend="EN">
                    <b-form-input
                      required
                      placeholder="In English"
                      v-model.trim="message"
                    ></b-form-input>
                  </b-input-group>
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
                      <b-button variant="danger" @click="deleteMes">
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
          </b-card>
        </b-row>
      </b-container>
    </b-overlay>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { db } from "../../firebase";
export default {
  data() {
    return {
      messages: [],
      message: null,
      index: null,
      edit: null,
      submitting: false,
    };
  },
  computed: {
    ...mapState({ adminDetails: (state) => state.settings.adminDetails }),
    ...mapState({ loadingAdmin: (state) => state.settings.loadingAdmin }),
  },
  beforeMount() {
    this.edit = this.$route.query.edit;
    this.index = this.$route.query.index;
    if (this.adminDetails) {
      this.init();
    }
  },
  methods: {
    init() {
      this.messages = this.adminDetails.messages;
      this.message = this.adminDetails.messages[this.index];
    },
    close() {
      this.$router.push({ name: "settingsPopups" });
    },
    submit() {
      db.collection("adminDetials")
        .doc(this.adminDetails.id)
        .update({ messages: this.messages })
        .then(() => {
          this.submitting = false;
          this.$router.go(-1);
        });
    },
    create() {
      this.submitting = true;
      this.edit
        ? (this.messages[this.index] = this.message)
        : this.messages.push(this.message);
      this.submit();
    },
    deleteMes() {
      this.submitting = true;
      var response = window.confirm("Are you sure?");
      if (response) {
        this.messages.splice(this.index, 1);
        console.log(this.messages);
        this.submit();
      } else {
        console.log(response);
      }
    },
  },
  watch: {
    loadingAdmin() {
      if (!this.loadingAdmin) {
        this.init();
      }
    },
  },
};
// import { mapState } from "vuex";
// // import { categoryCollection, storage } from "../firebase";
// export default {
//   data: () => {
//     return {
//       form: { displayNames: {} },
//       validation: { img: true },
//       imageData: null,
//       imageURL: null,
//       submitting: false,
//       edit: false,
//     };
//   },
//   computed: {
//     ...mapState({ categories: (state) => state.categories }),
//   },
//   mounted() {
//     this.init();
//   },
//   methods: {
//     async create() {
//       this.submitting = true;
//       if (!this.imageData && !this.edit) {
//         this.validation.img = false;
//         this.submitting = false;
//         return true;
//       } else {
//         this.validation.img = true;
//       }
//       this.submitting = true;
//       var catRef;
//       this.form.img = await this.uploadImage();
//       if (this.form.id && this.edit) {
//         catRef = categoryCollection.doc(this.form.id);
//       } else {
//         catRef = categoryCollection.doc();
//       }
//       var searchArray = this.createSearchArray(this.form.displayNames);
//       await catRef.set({
//         displayNames: {
//           en: this.form.displayNames["en"],
//           ml: this.form.displayNames["ml"],
//         },
//         imageUrl: this.form.img,
//         priority: this.form.priority,
//         searchArray: searchArray,
//       });
//       this.submitting = false;
//       this.$root.$bvToast.toast(`upload done`, {
//         title: "Category",
//         autoHideDelay: 5000,
//       });
//       this.$router.go(-1);
//     },
//     createSearchArray(value) {
//       var arr = [];
//       Object.values(value).forEach((name) => {
//         for (var i = 1; i <= name.length; i++) {
//           arr.push(name.trim().slice(0, i).toLowerCase());
//         }
//       });
//       return arr;
//     },
//     async uploadImage() {
//       if (this.imageData) {
//         var storageRef = storage.child(
//           "category_images/" + +new Date() + this.imageData["name"]
//         );
//         var snapshot = await storageRef.put(this.imageData);
//         return await snapshot.ref.getDownloadURL();
//       } else {
//         return this.form.img;
//       }
//     },
//     onFileChange(e) {
//       var input = e.target;
//       this.imageData = e.target.files[0];
//       if (input.files && input.files[0]) {
//         var reader = new FileReader();
//         reader.onload = (e) => {
//           this.imageURL = e.target.result;
//         };
//         reader.readAsDataURL(input.files[0]);
//       }
//     },
//     init() {
//       this.$store.dispatch("setCategories").then(() => {
//         this.fetchData();
//       });
//     },
//     fetchData() {
//       if (this.$route.query.edit && this.categories.length) {
//         this.edit = true;
//         var category = JSON.parse(
//           JSON.stringify(
//             this.categories.find(
//               (item) => item.id == this.$route.query.category
//             )
//           )
//         );
//         this.form.id = category.id;
//         this.form.name = category.name;
//         this.form.displayNames = category.displayNames;
//         this.form.priority = category.priority;
//         this.form.img = category.img;
//         this.imageURL = category.img;
//       }
//     },

//     deleteCat() {
//       var response = window.confirm("Are you sure?");
//       if (response) {
//         categoryCollection
//           .doc(this.form.id)
//           .delete()
//           .then(() => {
//             this.$root.$bvToast.toast("Deleted", {
//               title: "Category",
//               autoHideDelay: 5000,
//             });
//           });

//         this.$router.go(-1);
//       } else {
//         console.log(response);
//       }
//     },
//   },
//   watch: {
//     categories: function () {
//       this.fetchData();
//     },
//   },
// };
</script>

<style lang="scss" scoped>
.overlay {
  position: absolute;
  width: 100%;
  z-index: 10;
  background-color: rgba($color: #fff, $alpha: 0.5);
  height: 100%;
}
</style>