<template>
  <div class="user-profile-form">
    <v-toolbar
      absolute
      light
    >
      <v-layout
        class="top-bar"
        row
        align-center
      >
        <v-flex xs12>
          <user-avatar />
        </v-flex>
        <v-flex>
          <v-btn
            to="/"
            icon
            light
            nuxt >
            <v-icon>close</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-toolbar>

    <div class="form-container">
      <form class="form px-4 pt-4 pb-5">
        <v-text-field
          v-validate="'required|max:254'"
          v-model="profile.name"
          :counter="254"
          :error-messages="errors.collect('name')"
          label="Name"
          data-vv-name="name"
          required
          light
        />

        <v-select
          v-model="profile.type"
          :items="userTypes"
          label="Selecte usertype"
          item-text="verbose_name"
          item-value="id"
          item-disabled="disabled"
          light
        />

        <v-text-field
          v-validate="'email'"
          v-model="profile.email"
          :error-messages="errors.collect('email')"
          label="E-mail"
          data-vv-name="email"
          light
        />
        <v-text-field
          v-validate="'url'"
          v-if="false"
          v-model="profile.githubUrl"
          :error-messages="errors.collect('githubUrl')"
          label="GitHub profile"
          data-vv-name="githubUrl"
          light
        />
        <v-text-field
          v-validate="'url'"
          v-model="profile.twitter_url"
          :error-messages="errors.collect('twitter_url')"
          label="Twitter profile"
          data-vv-name="twitter_url"
          light
        />
        <v-text-field
          v-validate="'url'"
          v-model="profile.website_url"
          :error-messages="errors.collect('website_url')"
          label="Your website"
          data-vv-name="website_url"
          light
        />

        <v-text-field
          v-validate="'max:254'"
          v-model="profile.company"
          :counter="254"
          :error-messages="errors.collect('organisation')"
          data-vv-name="organisation"
          label="Organisation"
          light
        />

        <v-select
          v-model="profile.tags"
          :items="tagList"
          label="Tags"
          multiple
          tags
          chips
          deletable-chips
          light
        />

        <v-text-field
          v-validate="'max:500'"
          v-model="profile.bio"
          :error-messages="errors.collect('bio')"
          :counter="500"
          data-vv-name="bio"
          name="bio"
          label="Bio"
          textarea
          light
        />

      </form>
    </div>
    <v-layout
      class="user-profile-actions"
      align-center
      row
    >
      <div class="last-saved caption">
        Last saved on:
      </div>
      <v-spacer />
      <v-btn
        color="primary"
        class="ma-0"
        @click.stop="save">
        Save<span class="trim">&nbsp;changes</span>
      </v-btn>
    </v-layout>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import UserAvatar from './UserAvatar.vue';

export default {
  name: 'UserProfileForm',
  components: {
    UserAvatar
  },
  data () {
    return {
      profile: {
        name: '',
        email: '',
        twitter_url: '',
        website_url: '',
        company: '',
        tags: [],
        bio: ''
      }
    };
  },
  computed: {
    ...mapGetters({
      userProfile: 'user/getUserProfile',
      usLoggedIn: 'user/getLoginStatus',
      tagList: 'getTags',
      userTypes: 'getUserTypes'
    })
  },
  watch: {
    userProfile: {
      immediate: true,
      handler (p) {
        this.profile = {...p};
      }
    }
  },
  methods: {
    ...mapActions({
      updateUserProfile: 'user/updateUserProfile'
    }),
    async save () {
      await this.updateUserProfile(this.profile);
      this.$router.push('/');
    }
  }
};
</script>

<style lang="less">
  @import "../assets/style/variables.less";
  @import "../assets/style/mixins.less";

  .user-profile-form {
    height: 100%;
    border-radius: 3px;

    .toolbar {
      .toolbar__content {
        height: @map-card-height !important;
      }

      .top-bar {
        height: @map-card-height;
        padding: 0 12px;
        background-color: @color-white;
      }
    }

    .form-container {
      height: calc(100% - 80px);
      position: relative;
      top: @map-card-height;
      width: 100%;
      overflow-y: auto;
      padding-bottom: 48px;
    }

    .user-profile-actions {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: @map-card-height;
      padding: 0 12px;
      border-top: 1px solid @font-dark-dividers;
      background-color: @color-white;

      .last-saved {
        color: @font-dark-disabled;
      }

      .trim {
        display: inline-block;
      }
    }

    // Responsive
    .viewport-sm & {
      .trim {
        display: none;
      }
    }
  }
</style>
