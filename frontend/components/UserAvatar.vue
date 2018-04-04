<template>
  <div class="avatar-wrapper">
    <v-avatar class="mr-2">
      <v-icon
        v-show="!isLoggedIn"
        light
      >
        account_circle
      </v-icon>
      <img
        v-show="isLoggedIn"
        :src="userProfile.avatarUrl" >
    </v-avatar>

    <div
      v-show="isLoggedIn">
      <div>{{ userProfile.name }}</div>
      <div> {{ userProfile.email }} </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  name: 'UserAvatar',
  computed: {
    ...mapGetters({
      userProfile: 'user/getUserProfile',
      isLoggedIn: 'user/getLoginStatus'
    }),
  }
};
</script>

<style lang="less">
  .avatar-wrapper {
    width: 100%;
    display: inline-flex;
    align-items: center;
  }

</style>
