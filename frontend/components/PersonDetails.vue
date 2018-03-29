<template>
  <v-card
    v-if="person"
    class="white--text person-details">
    <v-card-title primary-title>
      <div class="headline">{{ person.name }}</div>
      <div>{{ person.about }}</div>
    </v-card-title>
    <v-card-text>
      <v-list two-line>
        <v-subheader>
          Details
        </v-subheader>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title >
              Organisation
            </v-list-tile-title>
            <v-list-tile-sub-title >
              {{ person.organisation }}
            </v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title >
              Tags
            </v-list-tile-title>
            <v-list-tile-sub-title >
              <v-chip
                v-for="(tag, index) in person.tags"
                :key="index"
                small>
                {{ tag }}
              </v-chip>
            </v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title >
              GitHub
            </v-list-tile-title>
            <v-list-tile-sub-title >
              <a
                :href="person.githubUrl"
                target="_blank">
                {{ person.githubUrl }}
              </a>
            </v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title >
              Twitter
            </v-list-tile-title>
            <v-list-tile-sub-title >
              <a
                :href="person.twitterUrl"
                target="_blank">
                {{ person.twitterUrl }}
              </a>
            </v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title >
              Website
            </v-list-tile-title>
            <v-list-tile-sub-title >
              <a
                :href="person.websiteUrl"
                target="_blank">
                {{ person.websiteUrl }}
              </a>
            </v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <repository-list/>
    </v-card-text>
    <v-card-actions>
      <v-btn
        flat
        dark
        @click="closeDetails">
        Close
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import RepositoryList from './RepositoryList.vue';

export default {
  name: 'PersonDetails',
  components: {
    RepositoryList
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
    async closeDetails() {
      await this.setCurrent(null);
      this.$router.push('/');
    }
  }

};
</script>

<style lang="less">

.person-details {
  min-height: 100vh;
  overflow-x: hidden;
}

</style>
