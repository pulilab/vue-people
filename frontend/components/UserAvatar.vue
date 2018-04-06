<template>
  <div class="avatar-wrapper">
    <v-avatar class="mr-2">
      <v-icon
        v-show="!person.avatarUrl"
        light
      >
        account_circle
      </v-icon>
      <img
        v-show="person.avatarUrl"
        :src="person.avatarUrl" >
    </v-avatar>

    <div
      v-show="person.name">
      <div>
        <span>{{ person.name }}</span>
        <user-type :id="person.type" />
      </div>
      <div> {{ person.email }} </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import UserType from './UserType';

export default {
  name: 'UserAvatar',
  components: {
    UserType
  },
  props: {
    id: {
      type: Number,
      default: null
    }
  },
  computed: {
    ...mapGetters({
      getPersonDetails: 'people/getPersonDetails',
      userProfile: 'user/getUserProfile',
    }),
    person() {
      if (this.id) {
        return this.getPersonDetails(this.id);
      }
      return this.userProfile;
    }
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
