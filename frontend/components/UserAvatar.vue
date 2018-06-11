<template>
  <div class="avatar-wrapper">
    <v-avatar class="elevation-2">
      <div
        v-show="!person.avatar_url"
        class="no-avatar">
        <v-icon>
          account_circle
        </v-icon>
      </div>
      <div
        v-show="person.avatar_url"
        class="has-avatar">
        <img :src="person.avatar_url" >
      </div>
    </v-avatar>

    <div
      v-show="person.name"
      class="user-info mr-4"
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
      userProfile: 'user/getUserProfile'
    }),
    person () {
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
    display: flex;
    align-items: center;

    .avatar {
      width: 40px !important;
      height: 40px !important;
      margin-right: 12px;

      .no-avatar {
        float: left;
        width: 40px;
        height: 40px;
        background-color: @icon-dark-inactive;
        border-radius: 40px;
      }

      .has-avatar {
        width: 40px;
        height: 40px;

        img {
          width: 40px;
          height: 40px;
        }
      }
    }

    .user-info {
      .user {
        font-size: @font-size-base;
        font-weight: 500;
      }

      .email {
        color: @font-dark-secondary;
        .text-truncate();
        white-space: unset !important;
      }
    }

    // Responsive
    .viewport-sm & {
      .avatar {
        margin: 0;
      }

      .user-info {
        margin-left: 12px;
      }
    }
  }
</style>
