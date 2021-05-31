<template>
  <b-overlay>
    <b-container fluid>
      <b-row no-gutters class="text-center">
        <b-col md="6">
          <h4 v-if="edit">Edit {{ form.area }}</h4>
          <h4 v-else>Add a new Area.</h4>
        </b-col>
      </b-row>
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
                <!-- <b-col>
                <b-input-group prepend="ML">
                  <b-form-input
                    required
                    placeholder="In Malayalam"
                    v-model.trim="form.displayName['ml']"
                  >
                  </b-form-input>
                </b-input-group>
              </b-col> -->
              </b-row>
            </b-form-group>
          </b-col>
          <b-col class="flex-nowrap">
            <b-form-group
              class="text-center"
              label="Package image:"
              label-for="input-3"
            >
              <div class="text-danger" v-if="!validation.img">
                Select image.
              </div>
              <img style="max-height: 100px" class="pb-2" :src="imageURL" />
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
      <b-row align-h="center" class="py-3">
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
            <b-button form="area-form" variant="success" type="submit">
              Submit</b-button
            >
          </b-overlay>
        </b-col>
      </b-row>
    </b-container>
  </b-overlay>
</template>
<script>
import { mapState } from "vuex";
import addLocation from "./addLocation.vue";
export default {
  components: { addLocation },
  computed: {
    ...mapState({ adminDetails: (state) => state.settings.adminDetails }),
    ...mapState({ loadingAdmin: (state) => state.settings.loadingAdmin }),
    ...mapState({
      locationsLoading: (state) => state.settings.locationsLoading,
    }),
    ...mapState({ datLocations: (state) => state.settings.locations }),
    ...mapState({ areaImages: (state) => state.settings.areaImages }),
  },
  data() {
    return {
      validation: {
        img: true,
        locations: true,
      },
      imageURL: "",
      form: { area: null },
      locations: [{ locality: "", minAmount: null, type: 0 }],
      // type: 0-input,1-new,2-edit
      submitting: false,
      // inits
      edit: null,
      needinit: true,
      initLoad: false,
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
    deletePack() {},
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
    createArea() {
      let needVerification = false;
      // img validation
      if (!this.edit && !this.imageData) {
        this.validation.img = false;
        needVerification = true;
      } else {
        this.validation.img = true;
      }
      // error checking
      if (this.edit) {
        console.log("edit");
      } else {
        console.log("new");
        let temp = this.adminDetails.areaNames.slice(0);
        temp.push(this.form.area);
      }

      // this.submitting = true;
    },
    //////////////////init fns ////////////////
    init() {
      if (
        this.edit &&
        this.adminDetails &&
        this.adminDetails.areaNames.includes(this.$route.query.area)
      ) {
        this.form.area = this.$route.query.area;
        this.initLoad = true;
        this.$store.dispatch("getSettingsLocations", {
          area: this.form.area,
          forced: true,
        });
      }
    },
    getlocations() {
      this.imageURL = this.areaImages[this.form.area];
      // Object.assign(this.locations, this.datLocations[this.form.area])
      var temp;
      this.datLocations[this.form.area].forEach((element) => {
        temp = {};
        Object.assign(temp, element);
        this.locations.push(temp);
      });
      this.initLoad = false;
      this.needinit = false;
    },
  },
  watch: {
    loadingAdmin() {
      if (this.loadingAdmin == false && this.needinit) {
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