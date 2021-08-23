<template>
  <b-overlay
    :show="loading"
    rounded
    spinner-small
    opacity="0.6"
    spinner-variant="primary"
  >
    <div class="w-100 position-relative">
      <!-- <div
        v-if="locationPrompt"
        class="position-absolute w-100 h-100 d-flex align-items-center justify-content-center"
        style="
          background-color: rgba(255, 255, 255, 0.7);
          z-index: 10;
          min-height: 350px;
        "
      >
        <add-location-prompt
          @locationAdd="locationAdd"
          :location="singleLocation"
        />
      </div> -->
      <b-form @submit.prevent="saveFn">
        <b-table
          sticky-header="350px"
          small
          :items="locations"
          :fields="fields"
          :tbody-tr-class="inputRow"
          hover
        >
          <template #cell(index)="data">
            {{ data.index == 0 ? "Add" : data.index }}
          </template>
          <template #cell(locality)="data">
            <b-input
              required
              v-if="singleLocationIndex == data.index"
              v-model.trim="singleLocation.locality"
            ></b-input>
            <div v-else>{{ data.item.locality }}</div>
          </template>
          <template #cell(minAmount)="data">
            <b-input
              required
              type="number"
              v-model.number="singleLocation.minAmount"
              v-if="singleLocationIndex == data.index"
            ></b-input>
            <div v-else>{{ data.item.minAmount }}</div>
          </template>
          <template #cell(delivery_charge)="data">
            <b-input
              required
              type="number"
              v-model.number="singleLocation.delivery_charge"
              v-if="singleLocationIndex == data.index"
            ></b-input>
            <div v-else>{{ data.item.delivery_charge }}</div>
          </template>
          <template #cell(express_delivery_charge)="data">
            <b-input
              required
              type="number"
              v-model.number="singleLocation.express_delivery_charge"
              v-if="singleLocationIndex == data.index"
            ></b-input>
            <div v-else>{{ data.item.express_delivery_charge }}</div>
          </template>
          <template #cell(actions)="data">
            <div
              class="d-flex align-content-center justify-content-between w-100"
              v-if="singleLocationIndex == data.index"
            >
              <b-button size="sm" type="submit" :key="1" variant="success">
                save
              </b-button>
              <b-button
                v-if="data.item.type != 10 && data.index != 0"
                size="sm"
                variant="danger"
                @click="deleteFn()"
                >delete</b-button
              >
            </div>
            <div
              class="d-flex align-content-center justify-content-between w-100"
              v-else
            >
              <b-button size="sm" type="button" @click="editFn(data)" :key="2"
                >edit</b-button
              >
            </div>
          </template>
        </b-table>
      </b-form>
    </div>
  </b-overlay>
</template>

<script>
import Vue from "vue";
export default {
  // components: { addLocationPrompt },
  props: ["locations", "validation", "loading"],
  data() {
    return {
      singleLocation: {},
      singleLocationIndex: 0,
      fields: [
        "index",
        { key: "locality", label: "Locality" },
        { key: "minAmount", label: "Min amount" },
        { key: "delivery_charge", label: "Delivery Charge" },
        { key: "express_delivery_charge", label: "Express delivery charge" },
        {
          key: "actions",
          label: "actions",
          thStyle: { width: "125px !important" },
        },
      ],
    };
  },
  mounted() {},
  methods: {
    inputRow(item, type) {
      // type: 0-input,1-new,2-edit, 10-deleted
      if (item.type == 0) {
        return "table-info";
      }
      if (item.type == 1) {
        return "table-primary";
      }
      if (item.type == 2) {
        return "table-secondary";
      } else if (item.type == 10) {
        return "table-danger";
      }
    },
    editFn(data) {
      Object.assign(this.singleLocation, data.item);
      this.singleLocationIndex = data.index;
    },
    saveFn() {
      if (this.singleLocationIndex == 0) {
        //new input from zeroth index
        this.singleLocation.type = 1;
        this.locations.splice(1, 0, this.singleLocation);
      } else {
        if (this.singleLocation.id) {
          //already in database ,editing
          this.singleLocation.type = 2;
        } else {
          //already in table, editing
          this.singleLocation.type = 1;
        }
        Vue.set(this.locations, this.singleLocationIndex, this.singleLocation);
      }
      this.resetData();
    },
    deleteFn() {
      if (this.singleLocation.id) {
        //already in database , changing type to 10
        this.singleLocation.type = 10;
        Vue.set(this.locations, this.singleLocationIndex, this.singleLocation);
        this.resetData();
      } else {
        this.locations.splice(this.singleLocationIndex, 1);
        this.resetData();
      }
    },
    resetData() {
      this.singleLocationIndex = 0;
      this.singleLocation = {};
    },
  },
};
</script>

<style lang="scss" scoped>
// .actionsStyle {
//   // max-width: 125px;
// }
</style>