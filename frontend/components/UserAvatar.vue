<template>
  <div class="avatar-wrapper">
    <v-avatar>
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
      class="user-info mr-5"
    >
      <div class="user">
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
  @import "../assets/style/variables.less";
  @import "../assets/style/mixins.less";

  .avatar-wrapper {
    width: 100%;
    display: inline-flex;
    align-items: center;

    .avatar {
      margin-right: 12px;
    }

    .user-info {
      .user {
        font-size: @font-size-base;
        font-weight: 500;
      }

      .email {
        color: @font-dark-secondary;
      }
    }
  }

</style>
