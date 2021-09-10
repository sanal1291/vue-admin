<template>
  <div class="pt-2 px-2 h-100">
    <b-overlay :show="loadingAdmin">
      <b-card class="h-100">
        <template #header>
          <div class="between-center-flex-md">
            <h5>Edit details.</h5>
            <b-row class="flex-nowrap">
              <b-col cols="auto">
                <b-button :disabled="submitting" @click="cancel">
                  cancel
                </b-button>
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
                  <b-button variant="success" type="submit" form="about-form">
                    Submit</b-button
                  >
                </b-overlay>
              </b-col>
            </b-row>
          </div>
        </template>
        <b-form @submit.prevent="submitDetails" id="about-form" class="p-3">
          <b-row>
            <b-col sm="12" md="8" lg="6">
              <b-form-group label="Name:" label-for="input-2">
                <b-form-input
                  required
                  v-model="form.name"
                  id="input-2"
                  placeholder="Name"
                ></b-form-input>
              </b-form-group>
              <b-form-group label="Email:" label-for="input-2">
                <b-form-input
                  required
                  v-model="form.email"
                  id="input-2"
                  placeholder="Email"
                ></b-form-input>
              </b-form-group>
              <b-form-group label="Phone no:" label-for="input-2">
                <b-form-input
                  required
                  v-model="form.phone"
                  id="input-2"
                  placeholder="Phone no"
                ></b-form-input>
              </b-form-group>
              <b-form-group label="About:" label-for="input-2">
                <b-form-textarea
                  required
                  v-model="form.about"
                  id="input-2"
                  placeholder="About"
                ></b-form-textarea>
              </b-form-group>
              <b-overlay
                :show="submitting"
                rounded
                opacity="0.6"
                spinner-small
                spinner-variant="primary"
                class="d-inline-block float-right"
              >
              </b-overlay>
            </b-col>
          </b-row>
        </b-form>
      </b-card>
    </b-overlay>
  </div>
</template>




<script>
import { mapState } from "vuex";
import { db } from "../../firebase";
export default {
  data: function () {
    return {
      validation: {
        img: true,
        items: true,
      },
      form: {
        name: null,
        phone: null,
        email: null,
      },
      submitting: false,
    };
  },
  beforeMount() {
    if (this.adminDetails) {
      this.init();
    }
  },
  computed: {
    ...mapState({ loadingAdmin: (state) => state.settings.loadingAdmin }),
    ...mapState({ adminDetails: (state) => state.settings.adminDetails }),
  },
  methods: {
    cancel() {
      this.$router.go(-1);
    },
    init() {
      this.form.phone = this.adminDetails.phone;
      this.form.email = this.adminDetails.email;
      this.form.name = this.adminDetails.adminName;
      this.form.about = this.adminDetails.about;
    },
    async submitDetails() {
      this.submitting = true;
      await db.collection("adminDetials").doc(this.adminDetails.id).update({
        about: this.form.about,
        adminName: this.form.name,
        phone: this.form.phone,
        email: this.form.email,
      });
      this.$root.$bvToast.toast(`Update done`, {
        title: "About",
        autoHideDelay: 5000,
      });

      this.submitting = false;
      this.$router.go(-1);
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
</script>

<style lang="scss" scoped>
</style>