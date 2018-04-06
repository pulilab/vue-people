<template>
  <div class="person-details">
    <v-toolbar
      light
      prominent
      extended
      absolute>
      <v-btn
        light
        icon
        nuxt
        to="/">
        <v-icon>arrow_back</v-icon>
        back
      </v-btn>
      <v-spacer/>
      <v-btn
        icon
        light>
        <v-icon>more_vert</v-icon>
      </v-btn>
      <user-avatar
        v-if="person"
        slot="extension"
        :id="person.id"
      />
    </v-toolbar>
    <div
      v-if="person"
      class="person-info">
      <div class="item">
        <v-layout row>
          <v-btn
            :href="person.githubUrl"
            icon
            large
            target="_blank">
            <v-icon>mdi-github-circle</v-icon>
          </v-btn>
          <v-btn
            :href="person.twitterUrl"
            icon
            large
            target="_blank">
            <v-icon>mdi-twitter</v-icon>
          </v-btn>
          <v-btn
            :href="person.websiteUrl"
            icon
            large
            target="_blank">
            <v-icon>mdi-web</v-icon>
          </v-btn>
        </v-layout>
      </div>
      <div class="item">
        <div class="title">
          About
        </div>
        <div class="content">
          {{ person.about }}
        </div>
      </div>
      <div class="item">
        <div class="title" >
          Organisation
        </div>
        <div class="content">
          {{ person.organisation }}
        </div>
      </div>
      <div class="item">
        <div class="title" >
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
    async closeDetails() {
      await this.setCurrent(null);
      this.$router.push('/');
    }
  }

};
</script>

<style lang="less">

.person-details {
  position: relative;
  width: 100%;

  .person-info {
    position: relative;
    padding-top: 150px;
  }
}

</style>
