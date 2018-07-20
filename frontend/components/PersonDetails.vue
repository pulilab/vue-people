<template>
  <div class="person-details">
    <v-toolbar
      light
      prominent
      extended
      absolute
      class="elevation-4 px-4 pb-4">
      <v-layout align-center>
        <v-flex xs12>
          <v-btn
            light
            flat
            nuxt
            to="/"
            class="btn-back ma-0">
            <v-icon class="mr-1">arrow_back</v-icon>
            back
          </v-btn>
        </v-flex>
        <v-flex>
          <v-btn
            :disabled="!person.latlng"
            icon
            light
            class="btn-center-focus ma-0"
            @click="centerOnCurrentPerson">
            <v-icon>filter_center_focus</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
      <user-avatar
        v-if="person"
        slot="extension"
        :id="person.id"
      />
    </v-toolbar>
    <div class="person-info-container">
      <div
        v-if="person"
        class="person-info">
        <div class="item px-4 py-3">
          <v-layout row>
            <v-btn
              :href="person.github_url"
              :disabled="!person.github_url"
              flat
              target="_blank">
              <v-icon class="mr-1">mdi-github-circle</v-icon>
              Github
            </v-btn>
            <v-btn
              :href="person.twitter_url"
              :disabled="!person.twitter_url"
              flat
              target="_blank">
              <v-icon class="mr-1">mdi-twitter</v-icon>
              Twitter
            </v-btn>
            <v-btn
              :href="person.website_url"
              :disabled="!person.website_url"
              flat
              target="_blank">
              <v-icon class="mr-1">mdi-web</v-icon>
              Website
            </v-btn>
          </v-layout>
        </div>
        <div class="item px-4 py-3">
          <div class="caption">
            About
            <span
              v-if="person.hireable"
              class="hireable"
            >
              <v-icon small>
                how_to_reg
              </v-icon>
              hireable
            </span>
          </div>
          <div class="content">
            {{ person.bio }}
          </div>
        </div>
        <div class="item px-4 py-3">
          <div class="caption">
            Organisation
          </div>
          <div class="content">
            {{ person.company }}
          </div>
        </div>
        <div class="item px-4 py-3">
          <div class="caption">
            Tags
          </div>
          <div class="content">
            <v-chip
              v-for="(tag, index) in person.tags"
              :key="index"
              small>
              {{ tag }}
            </v-chip>
          </div>
        </div>
        <repository-list/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import RepositoryList from './RepositoryList.vue';
import UserAvatar from './UserAvatar.vue';

export default {
  name: 'PersonDetails',
  components: {
    RepositoryList,
    UserAvatar
  },
  computed: {
    ...mapGetters({
      person: 'people/getCurrentPersonDetails'
    })
  },
  methods: {
    ...mapActions({
      setCurrent: 'people/setCurrent'
    }),
    centerOnCurrentPerson () {
      this.$root.$emit('map:center-on', this.person.latlng);
    }
  }

};
</script>

<style lang="less">
  @import "../assets/style/variables.less";
  @import "../assets/style/mixins.less";

  .person-details {
    position: relative;
    width: 100%;
    background-color: @color-brand-secondary;

    .toolbar {
      background-color: @color-white !important;

      .toolbar__content {
        .btn {
          &:not(.btn--icon) {
            min-width: 0;
            margin: 0;
            padding: 0 10px 0 6px;

            .btn__content {
              padding: 0;
            }
          }
        }
      }

      .user-info {
        .user {
          > span {
            max-width: 188px;
          }
        }

        .email {
          max-width: 220px;
        }
      }
    }

    .person-info-container {
      position: relative;
      height: calc(100% - 216px);
      top: 152px;
      width: 100%;
      max-width: 100%;
      overflow-y: auto;
      overflow-x: hidden;

      .person-info {
        position: relative;

        .btn {
          min-width: 0;
          margin: 0 12px 0 0;
          padding: 0;

          .btn__content {
            padding: 0 8px;
            font-size: @font-size-tiny;
            font-weight: 400;
            text-transform: none;
          }
        }
      }

      .item {
        border-bottom: 1px solid @font-light-dividers;

        .caption {
          margin-bottom: 12px;
          font-weight: 500;
          text-transform: uppercase;
          color: @font-light-disabled;

          .hireable {
            float: right;
            display: inline-block;
            padding: 0 8px 0 8px;
            height: 18px;
            line-height: 19px;
            background-color: #00C853;
            font-size: @font-size-tiny - 1;
            font-weight: 700;
            color: @color-white;
            border-radius: 20px;

            .icon {
              position: relative;
              top: -1px;
            }
          }
        }

        .content {
          flex-wrap: wrap;
          font-size: @font-size-tiny;
        }
      }
    }

    // Responsive
    .viewport-sm & {
      .btn-center-focus {
        display: none;
      }
    }
  }
</style>
