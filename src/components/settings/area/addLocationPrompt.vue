<template>
  <b-card no-body>
    <b-card-header v-if="location.edit"></b-card-header>
    <b-card-header v-else> <h5>Add New locality</h5></b-card-header>
    <b-form @submit.prevent="returnLocation" class="p-2">
      <b-form-group label="Locality name:">
        <b-form-input required v-model.trim="form.locality"> </b-form-input>
      </b-form-group>
      <b-form-group label="Minimum cost:">
        <b-form-input required type="number" v-model.trim="form.minAmount">
        </b-form-input>
      </b-form-group>
      <b-button type="submit">Submit</b-button>
    </b-form>
  </b-card>
</template>

<script>
export default {
  props: ["location"],
  data() {
    return {
      form: {},
    };
  },
  mounted() {
    this.form = this.location;
  },
  methods: {
    returnLocation() {
      this.$emit("locationAdd", this.form);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>