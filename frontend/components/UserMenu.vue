<template>
  <v-menu
    :close-on-content-click="false"
    v-model="menu"
    bottom
    left>
    <v-btn
      slot="activator"
      class="ml-5"
      color="red"
      large
      icon
      dark>
      <v-avatar class="user-avatar">
        <v-icon
          v-show="!isLoggedIn"
          dark>
          account_circle
        </v-icon>
        <img
          v-show="isLoggedIn"
          :src="userProfile.avatarUrl" >
      </v-avatar>
    </v-btn>
    <v-card>
      <v-list v-show="isLoggedIn">
        <v-list-tile
          to="/user/"
          avatar
          nuxt >
          <v-list-tile-avatar>
            <img :src="userProfile.avatarUrl" >
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{ userProfile.name }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ userProfile.email }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-divider/>
      <v-card-actions>
        <v-btn
          v-show="isLoggedIn"
          flat
          @click="doLogout">
          Logout
        </v-btn>
        <v-btn
          v-show="!isLoggedIn"
          :href="gitHubUrl"
          flat>
          Login
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { gitHubOauthLink } from '~/integrations/github/utilities';

export default {
  data() {
    return {
      menu: false,
      fav: false
    };
  },
  computed: {
    ...mapGetters({
      userProfile: 'user/getUserProfile',
      isLoggedIn: 'user/getLoginStatus'
    }),
    gitHubUrl() {
      return gitHubOauthLink();
    }
  },
  methods: {
    ...mapActions({
      logout: 'user/logout'
    }),
    doLogout() {
      this.menu = false;
      this.logout();
    }
  }
};
</script>

<style>

</style>
