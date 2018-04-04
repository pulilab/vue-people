<template>
  <v-card>
    <v-card-title>
      <v-layout row>
        <v-flex>
          <user-avatar />
        </v-flex>
        <v-flex class="pull-right">
          <v-btn
            to="/"
            icon
            nuxt >
            <v-icon>close</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-card-title>
    <v-card-text>
      <form>
        <v-text-field
          v-validate="'required|max:254'"
          v-model="profile.name"
          :counter="254"
          :error-messages="errors.collect('name')"
          label="Name"
          data-vv-name="name"
          required
        />
        <v-text-field
          v-validate="'email'"
          v-model="profile.email"
          :error-messages="errors.collect('email')"
          label="E-mail"
          data-vv-name="email"
        />
        <v-text-field
          v-validate="'url'"
          v-model="profile.githubUrl"
          :error-messages="errors.collect('githubUrl')"
          label="GitHub profile"
          data-vv-name="githubUrl"
        />
        <v-text-field
          v-validate="'url'"
          v-model="profile.twitterUrl"
          :error-messages="errors.collect('twitterUrl')"
          label="Twitter profile"
          data-vv-name="twitterUrl"
        />
        <v-text-field
          v-validate="'url'"
          v-model="profile.websiteUrl"
          :error-messages="errors.collect('websiteUrl')"
          label="Your website"
          data-vv-name="websiteUrl"
        />
        <v-select
          :items="organisations"
          v-model="profile.organisation"
          label="Organisation"
          autocomplete
        />

        <v-select
          v-model="profile.tags"
          :items="tagList"
          label="Tags"
          multiple
          tags
          chips
          deletable-chips
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
        />

      </form>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        color="primary"
        @click.stop="save">
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
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
      userProfile: 'user/getUserProfile'
    }),
    tagList () {
      return ['vue'];
    },
    organisations () {
      return ['Pulilab', 'GitHub', 'Vidzor'];
    }
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
</style>
