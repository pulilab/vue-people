<template>
  <v-menu
    v-model="menu"
    bottom
    left>
    <user-avatar slot="activator" />
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
