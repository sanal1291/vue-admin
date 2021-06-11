<template>
  <div class="overlay">
    <b-overlay :show="loading">
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
                <b-col v-if="edit"> Edit {{ form.name }}id:{{ form.id }}</b-col>
                <b-col v-else>Create a Indipendent item.</b-col>
              </b-row>
            </b-card-title>
            <b-card-text>
              <b-form @submit.prevent="create">
                <b-row>
                  <b-col>
                    <b-form-group label="Name of Item:" label-for="input-1">
                      <b-input-group id="input-1" prepend="EN">
                        <b-form-input
                          required
                          placeholder="In English"
                          v-model.trim="form.displayNames['en']"
                        ></b-form-input>
                      </b-input-group>
                      <b-input-group class="pt-3" id="input-1" prepend="ML">
                        <b-form-input
                          required
                          placeholder="In malayalam"
                          v-model.trim="form.displayNames['ml']"
                        ></b-form-input>
                      </b-input-group>
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
      ></b-overlay
    >
  </div>
</template>

<script>
import { mapState } from "vuex";
import { indipendentItemCollection, storage } from "../firebase";
export default {
  data: () => {
    return {
      form: { displayNames: {} },
      submitting: false,
      edit: false,
      loading: false,
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
      var indiRef;
      if (this.form.id && this.edit) {
        indiRef = indipendentItemCollection.doc(this.form.id);
      } else {
        indiRef = indipendentItemCollection.doc();
      }
      var searchArray = this.createSearchArray(this.form.name);
      try {
        indiRef
          .update({
            name: this.form.displayNames["en"],
            displayNames: this.form.displayNames,
            searchArray: searchArray,
          })
          .then(() => {
            // adding the updated value to state
            this.setUpdatedIndiItem(indiRef);
            this.submitting = false;
            this.$root.$bvToast.toast(`upload done`, {
              title: "Indipendent item",
              autoHideDelay: 5000,
            });
            this.$router.go(-1);
          });
      } catch (error) {
        this.$root.$bvToast.toast(error, {
          title: "Indipendent item",
          autoHideDelay: 5000,
        });
        this.$router.go(-1);
        this.submitting = false;
        return;
      }
    },
    async init() {
      if (this.$route.query.edit && this.$route.query.indiItemId) {
        this.edit = true;
        this.loading = true;
        indipendentItemCollection
          .doc(this.$route.query.indiItemId)
          .get()
          .then((doc) => {
            this.form.id = doc.id;
            this.form.name = doc.get("displayNames")["en"];
            this.form.displayNames = doc.get("displayNames");
            this.loading = false;
          });
      } else {
        this.loading = false;
      }
    },
    async setUpdatedIndiItem(docRef) {
      let doc = await docRef.get();
      var index = this.indiItems.findIndex((indi) => indi.id === doc.id);
      if (index >= 0) {
        this.indiItems[index] = {
          id: doc.id,
          ...doc.data(),
        };
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