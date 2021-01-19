<template>
  <b-container class="bg-color vh-100" align-v="center" fluid>
    <b-row align-v="center" align-h="center" class="h-100">
      <b-card>
        <b-row class="form-logo" align-h="center">
          <img src="@/assets/logo.png" alt="" srcset="" />
        </b-row>
        <b-row align-h="center">
          <b-col>
            <!-- form -->
            <b-form @submit.prevent="login">
              <b-form-group>
                <b-input-group class="mb-4">
                  <b-input-group-prepend>
                    <span class="input-group-text">
                      <b-icon icon="person"></b-icon>
                    </span>
                  </b-input-group-prepend>
                  <b-form-input
                    v-model.trim="loginForm.email"
                    placeholder="Username"
                  ></b-form-input>
                </b-input-group>
                <b-input-group class="mb-3">
                  <b-input-group-prepend>
                    <span class="input-group-text">
                      <b-icon icon="key"></b-icon>
                    </span>
                  </b-input-group-prepend>
                  <b-form-input
                    v-model.trim="loginForm.password"
                    placeholder="Password"
                    type="password"
                  >
                  </b-form-input>
                </b-input-group>
              </b-form-group>
              <b-row align-h="center">
                <b-overlay
                  :show="busy"
                  rounded
                  opacity="0.6"
                  spinner-small
                  spinner-variant="secondary"
                  class="d-inline-block"
                >
                  <b-button class="px-5" type="submit">Login</b-button>
                </b-overlay>
              </b-row>
            </b-form>
            <!-- form end -->
          </b-col>
        </b-row>
      </b-card>
    </b-row>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        email: "",
        password: "",
      },
      busy: false,
      error: "",
    };
  },
  methods: {
    login: function () {
      this.busy = true;
      this.$store
        .dispatch("login", {
          email: this.loginForm.email,
          password: this.loginForm.password,
        })
        .then(
          () => {
            this.busy = false;
          },
          (error) => {
            console.log(error);
            this.busy = false;
          }
        );
    },
  },
};
</script>

<style lang="scss" scoped>
.bg-color {
  background-color: #60a3bc;
  .form-logo {
    margin-top: -100px;
  }
}
</style>