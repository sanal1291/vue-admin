<template>
  <b-container fluid class="p-0 h-100">
    <b-row align-v="center" no-gutters>
      <b-col
        class="p-2"
        cols="12"
        md="4"
        lg="3"
        v-for="(item, index) in paths"
        :key="index"
      >
        <b-card no-body class="text-center click_cards p-0 m-0">
          <b-link :to="item.path" class="click_cards_body text-primary">
            <b-card-body>
              <div>
                <b-icon :scale="item.scale" :icon="item.icon"></b-icon>
                <div>{{ item.name }}</div>
              </div>
            </b-card-body>
          </b-link>
        </b-card>
      </b-col>
      <!-- <b-button @click.prevent :to="{ name: 'settingsPopups' }">Popups</b-button> -->
    </b-row>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      scale: { value: 1, key: null },
      paths: [
        {
          path: { name: "settingsPopups" },
          name: "Popup messages",
          icon: "twitch",
        },
        {
          path: { name: "settingsareaHome" },
          name: "Area",
          icon: "map",
        },
        {
          path: { name: "settingsAbout" },
          name: "About",
          icon: "info",
        },
        {
          path: { name: "settingsPopups" },
          name: "testing____",
          icon: "twitch",
        },
      ],
    };
  },
  methods: {
    handleHover(hovered) {},
  },
};
</script>

<style lang="scss" scoped>
.click_cards {
  &:hover {
    cursor: pointer;
  }
  .click_cards_body {
    text-decoration: none;
  }
}
</style>