<template>
  <div class="pt-2 px-2 h-100">
    <b-overlay :show="loadingAdmin">
      <b-card class="h-100">
        <template #header>
          <div class="between-center-flex-md">
            <h5>Next day holiday?</h5>
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
              <b-form-group label="Tomorrow Holiday:" label-for="input-2">
                <b-form-checkbox
                  v-model="form.checked"
                  name="check-button"
                  switch
                >
                  {{ form.checked ? "holiday" : "working day" }}
                </b-form-checkbox>
              </b-form-group>
              <b-form-group label="Today Holiday:" label-for="input-2">
                <b-form-checkbox
                  v-model="form.checked2"
                  name="check-button"
                  switch
                >
                  {{ form.checked2 ? "holiday" : "working day" }}
                </b-form-checkbox>
              </b-form-group>
              <b-form-group label="Reason:" label-for="input-2">
                <b-form-textarea
                  required
                  v-model="form.reason"
                  id="input-2"
                  placeholder="About"
                ></b-form-textarea>
              </b-form-group>
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
      validation: {},
      form: {
        checked: false,
        checked2: false,
        reason: null,
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
      this.form.checked = this.adminDetails.holiday.tomorrow;
      this.form.checked2 = this.adminDetails.holiday.today;
      this.form.reason = this.adminDetails.holiday.reason;
    },
    async submitDetails() {
      this.submitting = true;
      await db
        .collection("adminDetials")
        .doc(this.adminDetails.id)
        .update({
          holiday: {
            today: this.form.checked2,
            tomorrow: this.form.checked,
            reason: this.form.reason,
          },
        });
      this.$root.$bvToast.toast(`Update done`, {
        title: "Holiday",
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