<template>
  <b-form-group class="text-center" label="Package image:" label-for="input-3">
    <img
      style="max-height: 100px"
      class="pb-2"
      :src="imageURL ? imageURL : oldImageURL"
    />
    <div>
      <b-form-file
        class="mr-2"
        size="sm"
        :required="edit ? false : true"
        style="width: auto"
        type="file"
        accept="image/*"
        id="input-3"
        placeholder="Select image"
        @change="onFileChange"
        ref="input-image-field"
      ></b-form-file>
      <b-button v-if="imageData" @click="reset" variant="danger" size="sm"
        >Clear</b-button
      >
    </div>
  </b-form-group>
</template>

<script>
export default {
  // imageData -details of files, imageURL url to show image
  props: ["oldImageURL", "edit"],
  data() {
    return {
      imageData: null,
      imageURL: null,
    };
  },
  methods: {
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
    reset() {
      this.imageData = null;
      this.imageURL = this.oldImageURL;
      this.$refs["input-image-field"].reset();
    },
  },
  watch: {
    imageData() {
      this.$emit("changed", this.imageData);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
////// :edit="edit"  :oldImageURL="imageURL" @changed="imageChanged"
// imageChanged(data) {
//       console.log(data);
//       this.imageData = data;
//     },