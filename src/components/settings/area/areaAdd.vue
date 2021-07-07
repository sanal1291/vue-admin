<template>
  <b-overlay>
    <b-card class="h-100">
      <template #header>
        <div class="d-flex justify-content-between flex-wrap">
          <h5 v-if="edit">Edit {{ form.area }}</h5>
          <h5 v-else>Add a new Area.</h5>
          <b-row>
            <b-col cols="auto">
              <b-button :disabled="submitting" @click="cancel">
                cancel
              </b-button>
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
                <b-button type="button" @click="deleteArea" variant="danger">
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
                <b-button form="area-form" variant="success" type="submit">
                  Submit</b-button
                >
              </b-overlay>
            </b-col>
          </b-row>
        </div>
      </template>
      <b-container fluid>
        <b-form @submit.prevent="createArea" id="area-form">
          <b-row no-gutters>
            <b-col md="6">
              <b-form-group label="Name of Area:" label-for="input-1">
                <b-row no-gutters>
                  <b-col>
                    <b-input-group>
                      <b-form-input required v-model.trim="form.area">
                      </b-form-input>
                    </b-input-group>
                  </b-col>
                </b-row>
              </b-form-group>
            </b-col>
            <b-col class="flex-nowrap">
              <image-input
                :edit="edit"
                :oldImageURL="imageURL"
                @changed="imageChanged"
              />
            </b-col>
          </b-row>
        </b-form>
        <b-row no-gutters>
          <b-col class="pr-4">
            <b-card no-body style="max-height: 500px">
              <b-card-header style="background-color: #6c757d">
                Locations
              </b-card-header>
              <add-location
                :locations="locations"
                :validation="validation.locations"
                :loading="initLoad"
              />
            </b-card>
          </b-col>
        </b-row>
      </b-container>
    </b-card>
  </b-overlay>
</template>
<script>
import { mapState } from "vuex";
import {
  AreaCollection,
  db,
  locationCollection,
  storage,
} from "../../../firebase";
import ImageInput from "../../imageInput.vue";
import addLocation from "./addLocation.vue";
export default {
  components: { addLocation, ImageInput },
  computed: {
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
      validation: {
        locations: true,
      },
      imageURL: "",
      imageData: null,
      form: { id: null, area: null },
      locations: [{ locality: "", minAmount: null, type: 0 }],
      // type: 0-input,1-new,2-edit
      submitting: false,
      // inits
      edit: null,
      // needinit: true,
      initLoad: true,
    };
  },
  mounted() {
    this.edit = this.$route.query.edit;
    this.init();
  },
  methods: {
    cancel() {
      this.$router.go(-1);
    },
    imageChanged(data) {
      this.imageData = data;
    },
    deleteArea() {
      var response = window.confirm("Delete " + this.form.area + "?");
      if (response) {
        var batch = db.batch();
        var docRef = AreaCollection.doc(this.form.id);
        batch.delete(docRef);
        this.locations.forEach((item) => {
          if (item.id) {
            docRef = locationCollection.doc(item.id);
            batch.delete(docRef);
          }
        });
        batch.commit().then(() => {
          this.processComplete("Delete done");
        });
      } else {
        console.log(response);
      }
    },
    async uploadImage() {
      if (this.imageData) {
        var storageRef = storage.child(
          "Areaimages/" + this.form.area + new Date().toISOString()
        );
        var snapshot = await storageRef.put(this.imageData);
        return await snapshot.ref.getDownloadURL();
      } else {
        return this.form.imageURL;
      }
    },
    async createArea() {
      try {
        let needVerification = false;
        // error checking
        this.submitting = true;
        var areaRef;
        var searchArray = this.createSearchArray(this.form.area);
        var locationArray = [];
        for (let index = 1; index < this.locations.length; index++) {
          if (this.locations[index].type != 0) {
            locationArray.push(this.locations[index]);
          }
        }
        if (this.form.id && this.edit) {
          areaRef = AreaCollection.doc(this.form.id);
        } else {
          areaRef = AreaCollection.doc();
        }
        this.form.imageURL = await this.uploadImage();
        await areaRef
          .set({
            name: this.form.area,
            imageURL: this.form.imageURL,
          })
          .then(() => {
            this.manageLocations(locationArray, areaRef.id);
          });
      } catch (error) {
        console.log(error);
        this.submitting = false;
      }
    },
    manageLocations(items, id) {
      var locationRef;
      var searchArray;
      var batch = db.batch();
      items.forEach((item) => {
        searchArray = this.createSearchArray(item.locality);
        switch (item.type) {
          case 1:
            locationRef = locationCollection.doc();
            batch.set(locationRef, {
              areaId: id,
              locality: item.locality,
              minAmount: item.minAmount,
              searchArray: searchArray,
            });
            break;
          case 2:
            locationRef = locationCollection.doc(item.id);
            batch.update(locationRef, {
              areaId: id,
              locality: item.locality,
              minAmount: item.minAmount,
              searchArray: searchArray,
            });
            break;
          case 10:
            locationRef = locationCollection.doc(item.id);
            batch.delete(locationRef);
            break;
          default:
            break;
        }
      });
      batch.commit().then(() => {
        this.$store.dispatch("getSettingsLocations", {
          id: id,
          forced: true,
        });
        this.processComplete("Upload done");
      });
    },
    processComplete(message) {
      this.submitting = false;
      this.$root.$bvToast.toast(message, {
        title: "Area/locations",
        autoHideDelay: 5000,
      });
      this.$router.go(-1);
    },
    createSearchArray(value) {
      var arr = [];
      for (var i = 1; i <= value.length; i++) {
        arr.push(value.trim().slice(0, i).toLowerCase());
      }
      return arr;
    },
    //////////////////init fns ////////////////
    init() {
      if (this.edit && this.areas) {
        var tempArea = null;
        tempArea = this.areas.find(
          (element) => element.id == this.$route.query.area
        );
        if (tempArea) {
          this.form.id = tempArea.id;
          this.form.area = tempArea.name;
          this.form.imageURL = tempArea.imageURL;
          this.imageURL = tempArea.imageURL;
          this.initLoad = true;
          this.$store.dispatch("getSettingsLocations", {
            id: tempArea.id,
            forced: true,
          });
        }
      }
      if (!this.edit) {
        this.initLoad = false;
      }
    },
    getlocations() {
      // Object.assign(this.locations, this.datLocations[this.form.area])
      var temp;
      this.datLocations[this.form.id].forEach((element) => {
        temp = {};
        Object.assign(temp, element);
        this.locations.push(temp);
      });
      this.initLoad = false;
      // this.needinit = false;
    },
  },
  watch: {
    areaLoading() {
      if (this.areaLoading == false && this.initLoad) {
        this.init();
      }
    },
    locationsLoading() {
      if (this.locationsLoading == false) {
        this.getlocations();
      }
    },
  },
};
</script>