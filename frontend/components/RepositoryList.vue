<template>
  <div class="repository-list">
    <v-progress-linear
      v-show="loading"
      indeterminate />
    <v-list>
      <v-subheader>Repositories</v-subheader>
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
    <v-list>
      <v-subheader>Contributions</v-subheader>
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
      contributed: 'people/getCurrentPersonContributed'
    })
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
      loadRepositories: 'people/loadRepositories'
    })
  }
};
</script>

<style>

</style>
