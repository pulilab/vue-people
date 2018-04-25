<template>
  <div :class="['user-menu', {'short-menu': showShortMenu, 'long-menu': showLongMenu}]">
    <div
      :class="{'logged-in': isLoggedIn, 'logged-out': !isLoggedIn}"
    >
      <template v-if="isLoggedIn" >
        <user-avatar/>
        <v-btn
          v-show="showAddLocationButton"
          color="primary"
          @click="setAddMode(true)"
        >
          <v-icon class="mr-1">add_location</v-icon>
          <span v-show="!showShortButtons">Add Location</span>
        </v-btn>
        <v-btn
          v-show="showConfirmButton"
          color="warning"
          @click="confirmLocation"
        >
          <v-icon class="mr-1">done</v-icon>
          <span v-show="!showShortButtons">Confirm Location</span>
        </v-btn>
      </template>

      <v-btn
        v-show="!isLoggedIn"
        :href="gitHubUrl"
        class="login-btn"
      >
        <v-icon class="mr-1">mdi-github-circle</v-icon>
        <span v-show="!showShortButtons">
          Login with GitHub
        </span>
        <span v-show="showShortButtons">
          Login
        </span>
      </v-btn>

      <v-menu
        v-model="menu"
        :content-class="menuContentClass"
        transition="slide-y-transition"
        bottom
      >
        <v-btn
          slot="activator"
          icon
          light>
          <v-icon>more_vert</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile
            v-if="isLoggedIn"
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
            v-if="isLoggedIn"
            v-show="showEditLocation"
            avatar
            active-class=""
            @click="setAddMode(true)">
            <v-list-tile-avatar>
              <v-icon>edit_location</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>Edit your location</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile
            avatar
            active-class=""
            @click="setGoToMap(false)">
            <v-list-tile-avatar>
              <img src="/logo-icon_only.svg" >
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>About vuepeople.org</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile
            v-if="isLoggedIn"
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
  data () {
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
    gitHubUrl () {
      return oauthLinkGenerator('github');
    },
    showAddLocationButton () {
      return !this.positionSet && !this.isAddMode;
    },
    showConfirmButton () {
      return this.positionSet && this.isAddMode;
    },
    showEditLocation () {
      return this.positionSet && !this.isAddMode;
    },
    showShortButtons () {
      return this.$mq === 'sm' || this.$mq === 'xs';
    },
    showLongMenu () {
      return this.menu && (this.$mq === 'sm' || this.$mq === 'xs');
    },
    showShortMenu () {
      return !this.menu && (this.$mq === 'sm' || this.$mq === 'xs');
    },
    menuContentClass () {
      return this.showLongMenu ? 'menu-user-menu-mobile' : 'menu-user-menu';
    }
  },
  methods: {
    ...mapActions({
      logout: 'user/logout',
      setAddMode: 'map/setAddMode',
      updateUserProfile: 'user/updateUserProfile',
      setGoToMap: 'setGoToMap'
    }),
    doLogout () {
      this.menu = false;
      this.logout();
    },
    async confirmLocation () {
      await this.updateUserProfile();
      this.setAddMode(false);
    }
  }
};
</script>

<style lang="less">
  @import "../assets/style/variables.less";
  @import "../assets/style/mixins.less";

  .user-menu {
    .logged-in,
    .logged-out {
      display: flex;
      height: 100%;
    }

    .logged-in {
      padding: 0 12px;
    }

    .logged-out {
      padding: 0 4px;

      .login-btn {
        background-color: @color-github !important;
      }
    }

    &.short-menu {
      .user-info {
        display: none;
      }
    }

    &.long-menu {
      width: 92vw;
    }
  }
</style>
