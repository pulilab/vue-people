<template>
  <div class="user-profile-form">
    <v-toolbar
      absolute
      light>
      <v-layout
        class="top-bar"
        row>
        <v-flex>
          <user-avatar
            :id="userProfile.id"
          />
        </v-flex>
        <v-flex class="pull-right">
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
      <form class="form">
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
          item-text="name"
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
          v-model="profile.twitterUrl"
          :error-messages="errors.collect('twitterUrl')"
          label="Twitter profile"
          data-vv-name="twitterUrl"
          light
        />
        <v-text-field
          v-validate="'url'"
          v-model="profile.websiteUrl"
          :error-messages="errors.collect('websiteUrl')"
          label="Your website"
          data-vv-name="websiteUrl"
          light
        />
        <v-select
          :items="organisations"
          v-model="profile.organisation"
          label="Organisation"
          autocomplete
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
          v-model="profile.about"
          :error-messages="errors.collect('about')"
          :counter="500"
          data-vv-name="about"
          name="about"
          label="About"
          textarea
          light
        />

      </form>
    </div>
    <v-layout
      class="actions"
      align-center
      row >
      <div class="last-saved black--text">
        last saved on:
      </div>
      <v-spacer />
      <v-btn
        color="primary"
        @click.stop="save">
        Save
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
  data() {
    return {
      profile: {
        name: '',
        email: '',
        githubUrl: '',
        twitterUrl: '',
        websiteUrl: '',
        organisation: '',
        tags: [],
        about: ''
      }
    };
  },
  computed: {
    ...mapGetters({
      userProfile: 'user/getUserProfile',
      usLoggedIn: 'user/getLoginStatus',
      tagList: 'getTags',
      organisations: 'getOrganizations',
      userTypes: 'getUserTypes'
    })
  },
  watch: {
    userProfile: {
      immediate: true,
      handler(p) {
        this.profile = {...p};
      }
    }
  },
  methods: {
    ...mapActions({
      saveUserProfile: 'user/saveUserProfile'
    }),
    async save() {
      await this.saveUserProfile(this.profile);
      this.$router.push('/');
    }
  }
};
</script>

<style lang="less">
  .pull-right {
    display: flex;
    justify-content: flex-end;
  }

  .user-profile-form {
    height: 100%;

    .top-bar {
      padding: 12px;
    }

    .form-container {
      height: calc(100% - 80px);
      position: relative;
      top: 80px;
      width: 100%;
      overflow-y: auto;

      .form {
        padding: 24px 24px 80px 24px;;
      }
    }

     .actions {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 0 12px;
        background-color: #FFF;
      }

  }
</style>
