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