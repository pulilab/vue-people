<template>
  <div :class="['user-menu', {'short-menu': showShortMenu, 'long-menu': showLongMenu}]">
    <div
      :class="{'logged-in': isLoggedIn, 'logged-out': !isLoggedIn}"
    >
      <template v-if="isLoggedIn" >
        <user-avatar/>
        <div class="location-actions">
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
        </div>
      </template>

      <div>
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
      </div>

      <div>
        <v-btn
          v-show="showEditLocation"
          icon
          light
          @click="centerOnUser"
        >
          <v-icon>filter_center_focus</v-icon>
        </v-btn>
      </div>

      <v-spacer v-show="!isLoggedIn" />

      <v-menu
        v-show="showMenu"
        v-model="menu"
        :content-class="menuContentClass"
        transition="slide-y-transition"
        bottom
      >

        <v-btn
          slot="activator"
          icon
          light>
          <v-icon v-show="!showLongMenu">more_vert</v-icon>
          <v-icon v-show="showLongMenu">close</v-icon>
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
              <v-icon>pin_drop</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>Edit your location</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile
            v-show="mobileMode"
            avatar
            active-class=""
            @click="setGoToMap(false)">
            <v-list-tile-avatar class="vueman">
              <img src="/icon-vueman.svg" >
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>About vuepeople.org</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile
            v-if="isLoggedIn"
            avatar
            active-class=""
            @click="doOptOut">
            <v-list-tile-avatar>
              <v-icon>sentiment_very_dissatisfied</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>Opt-out</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile
            v-if="isLoggedIn"
            avatar
            active-class=""
            @click="openSettingsDialog">
            <v-list-tile-avatar>
              <v-icon>settings</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>Settings</v-list-tile-title>
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
    mobileMode () {
      return this.$mq === 'sm' || this.$mq === 'xs';
    },
    showLongMenu () {
      return this.menu && this.mobileMode;
    },
    showShortMenu () {
      return !this.menu && this.mobileMode;
    },
    menuContentClass () {
      return this.showLongMenu ? 'menu-user-menu-mobile' : 'menu-user-menu';
    },
    showMenu () {
      return this.isLoggedIn || this.mobileMode;
    }
  },
  mounted () {
    if (this.mobileMode) {
      // this address the edge case where the classes are not updated on the first load
      this.$forceUpdate();
    }
  },
  methods: {
    ...mapActions({
      logout: 'user/logout',
      setAddMode: 'map/setAddMode',
      updateUserProfile: 'user/updateUserProfile',
      setGoToMap: 'setGoToMap',
      setOptOutDialogOpen: 'layout/setOptOutDialogOpen',
      setSettingsDialogOpen: 'layout/setSettingsDialogOpen'
    }),
    doLogout () {
      this.menu = false;
      this.logout();
    },
    doOptOut () {
      this.menu = false;
      this.setOptOutDialogOpen(true);
    },
    async confirmLocation () {
      await this.updateUserProfile();
      this.setAddMode(false);
    },
    centerOnUser () {
      this.$root.$emit('map:center-on', this.userProfile.latlng);
    },
    openSettingsDialog () {
      this.menu = false;
      this.setSettingsDialogOpen(true);
    }

  }
};
</script>

<style lang="less">
  @import "../assets/style/variables.less";
  @import "../assets/style/mixins.less";

  .user-menu {
    .location-actions {
      margin-left: 12px;

      .btn {
        min-width: auto;

        .btn__content {
          padding-left: 12px;
        }
      }
    }

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

    .menu {
      width: 48px;
    }

    &.short-menu {
      .user-info {
        display: none;
      }
    }

    &.long-menu {
      width: calc(100vw - 32px);
    }
  }

  .menu-user-menu-mobile {
    top: @map-card-height + 16 !important;
    left: 16px !important;
    width: calc(100vw - 32px) !important;
    min-width: calc(100vw - 32px) !important;
    max-width: calc(100vw - 32px) !important;
    border-radius: 0 0 3px 3px !important;
  }
</style>
