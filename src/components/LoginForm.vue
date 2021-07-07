<template>
  <b-overlay
    :show="busy"
    bg-color="#60a3bc"
    rounded
    opacity="1"
    class="d-inline-block w-100"
  >
    <template #overlay>
      <b-img
        class="pulse"
        width="200px"
        src="@/assets/logo.png"
        alt="freshgrown logo"
        srcset=""
      />
    </template>
    <b-container class="bg-color vh-100" align-v="center" fluid>
      <b-row
        v-if="!busy"
        align-v="center"
        align-h="center"
        class="h-100"
        no-gutters
      >
        <b-card class="form-card pb-4 px-2" no-body>
          <div class="form-logo-place">
            <b-row class="form-logo m-0">
              <b-img
                width="200px"
                src="@/assets/logo.png"
                alt="freshgrown logo"
                srcset=""
              />
            </b-row>
          </div>
          <b-col>
            <b-card-title title-tag="h5" class="text-center">
              Sign in to FreshGrown
            </b-card-title>
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
              <b-row align-h="center" class="text-danger mb-2">{{
                error
              }}</b-row>
              <b-row align-h="center">
                <b-button class="px-5" type="submit">Login</b-button>
              </b-row>
            </b-form>
            <!-- form end -->
          </b-col>
        </b-card>
      </b-row>
    </b-container>
  </b-overlay>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      loginForm: {
        email: "",
        password: "",
      },
    };
  },
  computed: {
    ...mapState({ error: (state) => state.auth.error }),
    ...mapState({ busy: (state) => state.auth.busy }),
  },
  methods: {
    login: function () {
      this.$store.dispatch("login", {
        email: this.loginForm.email,
        password: this.loginForm.password,
        redirect: this.$route.query,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.pulse {
  animation: pulse 3s infinite;
  margin: 0 auto;
  display: table;
  margin-top: 50px;
  animation-direction: alternate;
  -webkit-animation-name: pulse;
  animation-name: pulse;
}

@-webkit-keyframes pulse {
  0% {
    -webkit-transform: scale(1);
  }
  25% {
    -webkit-transform: scale(1.1);
  }
  50% {
    -webkit-transform: scale(1);
  }
  75% {
    -webkit-transform: scale(1.1);
  }
  100% {
    -webkit-transform: scale(1);
  }
}

@keyframes pulse {
  0% {
    -webkit-transform: scale(1);
  }
  25% {
    -webkit-transform: scale(1.1);
  }
  50% {
    -webkit-transform: scale(1);
  }
  75% {
    -webkit-transform: scale(1.1);
  }
  100% {
    -webkit-transform: scale(1);
  }
}
.bg-color {
  background-color: #60a3bc;
  .form-card {
    .form-logo-place {
      height: 90px;
    }
    .form-logo {
      justify-content: center;
      position: relative;
      top: -120px;
    }
  }
}
</style>