<template>
  <div class="avatar-wrapper">
    <v-avatar
      class="mr-2">
      <v-icon
        v-show="!person.avatarUrl"
        :light="!dark"
      >
        account_circle
      </v-icon>
      <img
        v-show="person.avatarUrl"
        :src="person.avatarUrl" >
    </v-avatar>

    <div
      v-show="person.name"
      :class="{dark}">
      <div>
        <span>{{ person.name }}</span>
        <user-type :id="person.type" />
      </div>
      <div class="email"> {{ person.email }} </div>
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
    },
    dark: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      getPersonDetails: 'people/getPersonDetails',
      userProfile: 'user/getUserProfile',
    }),
    person() {
      if (this.id !== null && this.id !== undefined) {
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

    .dark {
      color: #FFF;

      .email {
        color: rgba(255,255,255,0.5);
      }
    }
  }

</style>
