<template>
  <v-card
    class="white--text person-details">
    <v-card-title primary-title>
      <div class="headline">{{ person.name }}</div>
      <div>{{ person.about }}</div>
    </v-card-title>
    <v-card-text>
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
}

</style>
