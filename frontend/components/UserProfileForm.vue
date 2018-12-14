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
        align-content-space-between
      >
        <v-flex>
          <user-avatar />
        </v-flex>
        <v-flex>
          <v-btn
            to="/"
            icon
            light
            nuxt
          >
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
          :error-messages="errors.collect('Name')"
          label="Name"
          data-vv-name="Name"
          required
          light
        />

        <v-select
          v-model="profile.type"
          :items="userTypes"
          label="Select user type"
          item-text="verbose_name"
          item-value="id"
          item-disabled="disabled"
          light
        />

        <v-layout
          row
          class="switch-row email-group"
        >
          <v-flex>
            <v-text-field
              v-validate="'email'"
              v-model="profile.email"
              :error-messages="errors.collect('E-Mail')"
              label="E-mail"
              data-vv-name="E-Mail"
              light
            />
          </v-flex>

          <v-flex>
            <v-switch
              :label="publicEmailSwitchLabel"
              v-model="profile.public_email"
              light
              hide-details
              color="primary"
            />
          </v-flex>
        </v-layout>

        <div class="email-privacy-hint">
          <span v-show="profile.public_email">
            <v-icon small>info</v-icon>
            Your email will be visible in your user pin on the public map.</span>
          <span v-show="!profile.public_email">
            <v-icon small>info</v-icon>
            Your email will only be stored in the database and only displayed to you.</span>
        </div>

        <div class="permission-list">
          <div class="caption">
            Email me about
          </div>

          <v-layout
            row
            wrap
            class="checkbox-list"
          >
            <v-flex
              md6
              xs12
            >
              <v-checkbox
                v-model="profile.feature_updates"
                light
                hide-details
                label="Feature updates"
                color="primary"
              />
              <v-tooltip
                top
                right
              >
                <v-icon
                  slot="activator"
                  light
                >
                  help
                </v-icon>
                <span> You will be notified when new feature updates have been released on VuePeople.org. </span>
              </v-tooltip>
            </v-flex>

            <v-flex
              md6
              xs12
            >
              <v-checkbox
                v-model="profile.upcoming_events"
                light
                hide-details
                label="Upcoming Events"
                color="primary"
              />
              <v-tooltip
                top
                right
              >
                <v-icon
                  slot="activator"
                  light
                >
                  help
                </v-icon>
                <span> You will be notified about events, meetups and conferences within your pinned location. </span>
              </v-tooltip>
            </v-flex>

            <v-flex
              md6
              xs12
            >
              <v-checkbox
                v-model="profile.job_opportunities"
                light
                hide-details
                label="Job Opportunities"
                color="primary"
              />
              <v-tooltip
                top
                right
              >
                <v-icon
                  slot="activator"
                  light
                >
                  help
                </v-icon>
                <span> Your availability will be visible in your user pin on the public map. </span>
              </v-tooltip>
            </v-flex>
          </v-layout>
        </div>

        <div class="permission-list">
          <div class="caption">
            Jobs profile
          </div>

          <v-layout
            row
            wrap
            class="checkbox-list"
          >
            <v-flex
              md6
              xs12
            >
              <v-checkbox
                v-model="profile.hireable"
                light
                hide-details
                label="Available for hire"
                color="primary"
              />
              <v-tooltip
                top
                right
              >
                <v-icon
                  slot="activator"
                  light
                >
                  help
                </v-icon>
                <span> Show the hirable badge in your profile details </span>
              </v-tooltip>
            </v-flex>
          </v-layout>
        </div>

        <v-text-field
          v-validate="{url:'require_protocol'}"
          v-if="false"
          v-model="profile.githubUrl"
          :error-messages="errors.collect('GitHub Profile')"
          label="GitHub profile"
          data-vv-name="GitHub Profile"
          light
        />

        <v-text-field
          v-validate="{url:'require_protocol'}"
          v-model="profile.twitter_url"
          :error-messages="errors.collect('Twitter profile')"
          label="Twitter profile"
          data-vv-name="Twitter profile"
          light
        />

        <v-text-field
          v-validate="{url:'require_protocol'}"
          v-model="profile.website_url"
          :error-messages="errors.collect('Your website')"
          label="Your website"
          data-vv-name="Your website"
          light
        />

        <v-text-field
          v-validate="'max:254'"
          v-model="profile.company"
          :counter="254"
          :error-messages="errors.collect('Organisation')"
          data-vv-name="Organisation"
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
          :error-messages="errors.collect('Bio')"
          :counter="500"
          data-vv-name="Bio"
          name="Bio"
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
        Last saved on: {{ lastModified }}
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
import { format } from 'date-fns';

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
        public_email: false,
        feature_updates: false,
        upcoming_events: false,
        job_opportunities: false,
        hireable: false,
        twitter_url: '',
        website_url: '',
        company: '',
        tags: [],
        bio: '',
        modified: null
      }
    };
  },
  computed: {
    ...mapGetters({
      userProfile: 'user/getUserProfile',
      usLoggedIn: 'user/getLoginStatus',
      tags: 'getTags',
      userTypes: 'getUserTypes'
    }),
    tagList () {
      return this.tags.map(t => t.name);
    },
    publicEmailSwitchLabel () {
      return this.profile.public_email ? 'public' : 'private';
    },
    lastModified () {
      return this.profile.modified ? format(this.profile.modified, 'YYYY-MM-DD HH:mm') : '';
    }
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

        .flex {
          &:last-child {
            flex-grow: 0;
          }
        }
      }
    }

    .form-container {
      height: calc(100% - 80px);
      position: relative;
      top: @map-card-height;
      width: 100%;
      overflow-y: auto;
      padding-bottom: 48px;

      .switch-row {
        margin: 16px 0;

        .flex {
          &:last-child {
            flex-grow: 0;
            width: 100px;
            margin-left: 20px;
          }
        }

        .caption {
          margin: 8px 0;
          font-size: @font-size-tiny;
          color: @font-dark-primary;
        }

        &.email-group {
          margin: 0;

          .switch {
            padding-top: 18px;
          }
        }
      }

      .permission-list {
        display: block;
        width: 100%;
        margin: 24px 0;
        overflow: hidden;

        .flex {
          position: relative;
        }

        .caption {
          margin: 0 0 8px;
          color: @font-dark-secondary;
        }

        .checkbox {
          label {
            max-width: 60%;
          }
        }

        .tooltip {
          position: absolute;
          top: 3px;
          right: 20px;

          .icon {
            color: @font-dark-disabled;
          }
        }
      }

      .email-privacy-hint {
        font-size: @font-size-tiny;
        color: @font-dark-secondary;

        .icon {
          position: relative;
          top: -1px;
          color: @font-dark-disabled;
        }
      }
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
