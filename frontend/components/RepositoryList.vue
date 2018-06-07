<template>
  <div class="repository-list">
    <v-progress-linear
      v-show="loading"
      indeterminate
      class="ma-4" />
    <v-list
      v-show="!loading"
      class="px-4 pt-3 pb-2">
      <v-subheader>
        Repositories
      </v-subheader>
      <v-list-tile v-show="showNoRepositories">
        <v-list-tile-content>
          <v-list-tile-title class="no-data">
            No public Vuejs repositories
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

      <v-list-tile v-show="showFetchError">
        <v-list-tile-content>
          <v-list-tile-title class="fetch-error">
            <v-icon
              small>
              warning
            </v-icon>
            Failed to load this user's repositories
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

      <v-list-tile
        v-for="r in repositories"
        :key="r.node.id">
        <v-list-tile-content>
          <v-list-tile-title >
            <v-layout row>
              <v-flex xs8>
                {{ r.node.name }}
              </v-flex>
              <v-flex
                xs4
              >
                <div class="github-stats text-xs-right">
                  <v-icon
                    small>
                    star
                  </v-icon>
                  {{ r.node.stargazers.totalCount }}
                </div>
              </v-flex>
            </v-layout>
          </v-list-tile-title>
          <v-list-tile-sub-title >
            <a
              :href="r.node.url"
              target="_blank">
              {{ r.node.url }}
            </a>
          </v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>

    <v-list
      v-show="!loading"
      class="px-4 pt-3 pb-3">
      <v-subheader>
        Contribution
      </v-subheader>

      <v-list-tile v-show="showNoContributed">
        <v-list-tile-content>
          <v-list-tile-title class="no-data">
            No Contributions to public vuejs repositories
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

      <v-list-tile v-show="showFetchError">
        <v-list-tile-content>
          <v-list-tile-title class="fetch-error">
            <v-icon
              small>
              warning
            </v-icon>
            Failed to load this user's contributions
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile
        v-for="r in contributed"
        :key="r.node.id">
        <v-list-tile-content>
          <v-list-tile-title >
            <v-layout row>
              <v-flex xs8>
                {{ r.node.name }}
              </v-flex>
              <v-flex
                xs4
              >
                <div class="github-stats text-xs-right">
                  <v-icon
                    small>
                    star
                  </v-icon>
                  {{ r.node.stargazers.totalCount }}
                </div>
              </v-flex>
            </v-layout>
          </v-list-tile-title>
          <v-list-tile-sub-title >
            <a
              :href="r.node.url"
              target="_blank">
              {{ r.node.url }}
            </a>
          </v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';

export default {
  data () {
    return {
      loading: true,
      success: true
    };
  },
  computed: {
    ...mapGetters({
      current: 'people/getCurrentPerson',
      repositories: 'people/getCurrentPersonRepositories',
      contributed: 'people/getCurrentPersonContributed'
    }),
    showFetchError () {
      return !this.loading && !this.success;
    },
    showNoContributed () {
      return !this.showFetchError && this.contributed.length === 0;
    },
    showNoRepositories () {
      return !this.showFetchError && this.repositories.length === 0;
    }
  },
  watch: {
    current: {
      immediate: true,
      async handler (test) {
        this.loading = true;
        this.success = true;
        this.success = await this.loadRepositories();
        this.loading = false;
      }
    }
  },
  methods: {
    ...mapActions({
      loadRepositories: 'people/loadRepositories'
    })
  }
};
</script>

<style lang="less">
  @import "../assets/style/variables.less";
  @import "../assets/style/mixins.less";

  .repository-list {
    .progress-linear {
      width: calc(100% - 48px);
    }

    .list {
      padding: 0;
      border-bottom: 1px solid @font-light-dividers;
      background: @color-brand-secondary !important;

      &:last-child {
        border-bottom: 0;
      }

      .subheader {
        height: auto;
        margin-bottom: 12px;
        padding: 0;
        font-size: @font-size-tiny;
        text-transform: uppercase;
        color: @font-light-disabled;
      }

      .list__tile {
        height: auto;
        padding: 0;
        font-size: @font-size-tiny;

        .list__tile__content {
          margin-bottom: 12px;
        }

        .list__tile__title {
          font-weight: 500;

          &.no-data {
            font-weight: 400;
            color: rgba(255,255,255,.3);
          }

          &.fetch-error {
            .icon {
              position: relative;
              top: -2px;
              color: #FFD600;
            }
          }

          .github-stats {
            font-size: @font-size-tiny - 1;
            font-weight: 400;

            .icon {
              position: relative;
              top: -2px;
              font-size: @font-size-small - 1 !important;
              color: #FFB300;
            }
          }
        }

        .list__tile__sub-title {
          font-size: @font-size-tiny - 1;
        }
      }
    }
  }
</style>
