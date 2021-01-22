<template>
  <b-container class="bg-color vh-100" align-v="center" fluid>
    <b-row align-v="center" align-h="center" class="h-100">
      <b-card class="form-card">
        <div class="form-logo-place">
          <b-row class="form-logo w-100">
            <img src="@/assets/logo.png" alt="" srcset="" />
          </b-row>
        </div>
        <b-col>
          <b-card-title title-tag="h5" class="text-center"
            >Sign in to FreshGrown</b-card-title
          >
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
                  type="email"
                  required
                ></b-form-input>
              </b-input-group>
              <b-input-group>
                <b-input-group-prepend>
                  <span class="input-group-text">
                    <b-icon icon="key"></b-icon>
                  </span>
                </b-input-group-prepend>
                <b-form-input
                  v-model.trim="loginForm.password"
                  placeholder="Password"
                  type="password"
                  autocomplete="on"
                  required
                ></b-form-input>
              </b-input-group>
            </b-form-group>
            <b-row align-h="center" class="text-danger mb-2" v-show="error"
              >Username or password is incorrect.</b-row
            >
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
      error: false,
    };
  },
  methods: {
    login: function () {
      this.busy = true;
      this.error = false;
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
            this.error = true;
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
  .form-card {
    .form-logo-place {
      height: 70px;
    }
    .form-logo {
      justify-content: center;
      position: absolute;
      top: -110px;
    }
  }
}
</style>