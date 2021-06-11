<template>
  <b-overlay :show="loading">
    <b-link>
      <h6>User profile</h6>
      <ul>
        <li>id:{{ user.id }}</li>
        <li>Name:{{ user.fullname }}</li>
        <li>email/phone:{{ user.email }}</li>
      </ul>
    </b-link>
  </b-overlay>
</template>

<script>
import { userCollection } from "../../firebase";
export default {
  props: ["userId"],
  data() {
    return {
      user: {},
      loading: true,
    };
  },
  mounted() {
    userCollection
      .doc(this.userId)
      .get()
      .then((doc) => {
        this.user = {
          id: doc.id,
          ...doc.data(),
        };
        this.loading = false;
      });
  },
};
</script>

<style lang="scss" scoped>
</style>