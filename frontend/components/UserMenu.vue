<template>
  <div class="user-menu">
    <div
      v-show="isLoggedIn"
      class="logged-in"
    >
      <user-avatar/>
      <div class="btn-location">
        <v-btn
          v-show="showAddLocationButton"
          color="primary"
          @click="setAddMode(true)"
        >
          <v-icon class="mr-1">add_location</v-icon>
          Add Location
        </v-btn>
        <v-btn
          v-show="showConfirmButton"
          color="warning"
          @click="confirmLocation"
        >
          <v-icon class="mr-1">done</v-icon>
          Confirm Location
        </v-btn>
      </div>
      <v-menu
        v-model="menu"
        bottom
        left>
        <v-btn
          slot="activator"
          icon
          light>
          <v-icon>more_vert</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile
            to="/user/"
            active-class=""
            avatar
            nuxt >
            <v-list-tile-avatar>
              <v-icon>person</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>Edit profile</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile
            avatar
            active-class=""
            @click="doLogout">
            <v-list-tile-avatar>
              <v-icon>mdi-logout</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>Logout</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-menu>
    </div>
    <v-btn
      v-show="!isLoggedIn"
      :href="gitHubUrl"
      color="primary">
      <v-icon>mdi-github-circle</v-icon>
      Login with GitHub
    </v-btn>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { oauthLinkGenerator } from '~/utilities/auth';

import UserAvatar from './UserAvatar.vue';

export default {
  components: {
    UserAvatar
  },
  data() {
    return {
      menu: false
    };
  },
  computed: {
    ...mapGetters({
      userProfile: 'user/getUserProfile',
      isLoggedIn: 'user/getLoginStatus',
      positionSet: 'user/isPositionSet',
      isAddMode: 'map/isAddMode'
    }),
    gitHubUrl() {
      return oauthLinkGenerator('github');
    },
    showAddLocationButton() {
      return !this.positionSet && !this.isAddMode;
    },
    showConfirmButton() {
      return this.positionSet && this.isAddMode;
    }
  },
  methods: {
    ...mapActions({
      logout: 'user/logout',
      setAddMode: 'map/setAddMode',
      saveLocation: 'user/saveLocation'
    }),
    doLogout() {
      this.menu = false;
      this.logout();
    },
    async confirmLocation() {
      await this.saveLocation(this.userPosition);
      this.setAddMode(false);
    }
  }
};
</script>

<style lang="less">
  @import "../assets/style/variables.less";
  @import "../assets/style/mixins.less";

  .user-menu {
    .logged-in {
      display: flex;
      height: 100%;
      padding: 0 12px;
    }

    .btn-location {
      .btn .btn__content {
        padding-left: 10px;
      }
    }
  }
</style>
