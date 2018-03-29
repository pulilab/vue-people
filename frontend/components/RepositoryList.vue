<template>
  <div class="repository-list">
    <v-progress-linear
      v-show="loading"
      indeterminate />
    <v-list v-show="!loading">
      <v-subheader>
        <v-layout row>
          <v-flex xs6>
            Repositories
          </v-flex>
          <v-flex xs6>
            <v-switch
              v-show="repositories.length > 0"
              :label="repositoriesSortLabel"
              v-model="repositoriesDefaultSort"
              class="ml-5"
            />
          </v-flex>
        </v-layout>
      </v-subheader>
      <v-list-tile v-if="repositories.length === 0">
        <v-list-tile-content>
          <v-list-tile-title >
            No  VUEJS repositories
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile
        v-for="r in repositories"
        :key="r.node.id">
        <v-list-tile-content>
          <v-list-tile-title >
            {{ r.node.name }}
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
    <v-list v-show="!loading">
      <v-subheader>
        <v-layout row>
          <v-flex xs6>
            Contribution
          </v-flex>
          <v-flex xs6>
            <v-switch
              v-show="contributed.length > 0"
              :label="contributedSortLabel"
              v-model="contributedDefaultSort"
              class="ml-5"
            />
          </v-flex>
        </v-layout>
      </v-subheader>
      <v-list-tile v-if="contributed.length === 0">
        <v-list-tile-content>
          <v-list-tile-title >
            No Contributions in VUEJS repositories
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile
        v-for="r in contributed"
        :key="r.node.id">
        <v-list-tile-content>
          <v-list-tile-title >
            {{ r.node.name }}
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
  data() {
    return {
      loading: true
    };
  },
  computed: {
    ...mapGetters({
      current: 'people/getCurrentPerson',
      repositories: 'people/getCurrentPersonRepositories',
      contributed: 'people/getCurrentPersonContributed',
      getRepositoriesDefaultSort: 'people/getRepositoriesDefaultSort',
      getContributedDefaultSort: 'people/getContributedDefaultSort'
    }),
    repositoriesDefaultSort: {
      get () {
        return this.getRepositoriesDefaultSort === 'desc';
      },
      set (value) {
        if (!value) {
          this.setRepositoriesDefaultSort('asc');
        } else {
          this.setRepositoriesDefaultSort('desc');
        }
      }
    },
    repositoriesSortLabel() {
      return `Star order: ${this.repositoriesDefaultSort ? 'desc' : 'asc'}`;
    },
    contributedDefaultSort: {
      get () {
        return this.getContributedDefaultSort === 'desc';
      },
      set (value) {
        if (!value) {
          this.setContributedDefaultSort('asc');
        } else {
          this.setContributedDefaultSort('desc');
        }
      }
    },
    contributedSortLabel() {
      return `Star order: ${this.contributedDefaultSort ? 'desc' : 'asc'}`;
    }
  },
  watch: {
    current: {
      immediate: true,
      async handler(test) {
        this.loading = true;
        await this.loadRepositories();
        this.loading = false;
      }
    }
  },
  methods: {
    ...mapActions({
      loadRepositories: 'people/loadRepositories',
      setRepositoriesDefaultSort: 'people/setRepositoriesDefaultSort',
      setContributedDefaultSort: 'people/setContributedDefaultSort'
    })
  }
};
</script>

<style>

</style>
