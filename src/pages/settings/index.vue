<script>
export default {
  components: {},
  data() {
    return {
      cards: [
        {
          title: "The basic system",
          icon: "tabler-settings",
          route: "settings-basic-system",
        },
        {
          title: "Statistics",
          icon: "tabler-chart-dots",
          route: "settings-statistics",
        },
        {
          title: "Contact Details",
          icon: "tabler-phone",
          route: "settings-contact-details",
        },
        {
          title: "roles_management",
          icon: "tabler-user-check",
          route: "settings-roles",
        },
        {
          title: "users",
          icon: "tabler-users-group",
          route: "settings-users",
        },

        {
          title: "profile",
          icon: "tabler-user-circle",
          route: "settings-profile",
        },
      ],
    };
  },
  methods: {
    goToRoute(routeName) {
      this.$router.push({
        name: routeName,
      });
    },
  },
};
</script>

<template>
  <VRow class="match-height">
    <VCol
      v-for="(item, index) in cards"
      :key="index"
      md="2"
      cols="6"
      @click="goToRoute(item.route)"
    >
      <div
        class="v-card v-theme--light v-card--density-default v-card--variant-elevated"
        style="min-height: 180px; cursor: pointer"
      >
        <div
          class="v-card-text d-flex flex-column align-center justify-center h-100"
        >
          <VIcon :icon="item.icon" size="42" />
          <h3 class="text-body-2 mt-4 mb-0 text-center">
            {{ $t("common." + item.title) }}
          </h3>
        </div>
      </div>
    </VCol>
  </VRow>
</template>
