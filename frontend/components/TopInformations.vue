<template>
  <v-container
    fluid
    class="top-informations">
    <v-layout row>
      <v-flex xs8>
        <v-alert
          v-model="showAddAlert"
          color="primary"
          transition="scale-transition"
          dismissible
          type="info">
          Click on the map to add your position
        </v-alert>
      </v-flex>
      <v-flex offset-xs3>
        <user-menu/>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import UserMenu from './UserMenu.vue';
import {mapActions, mapGetters} from 'vuex';
export default {
  name: 'TopInformations',
  components: {
    UserMenu
  },
  computed: {
    ...mapGetters({
      addMode: 'map/isAddMode'
    }),
    showAddAlert: {
      get () {
        return this.addMode;
      },
      set () {
        return this.setAddMode(false);
      }
    }
  },
  methods: {
    ...mapActions({
      setAddMode: 'map/setAddMode'
    })
  }
};
</script>

<style lang="less">
  .top-informations {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    z-index: 10;
    margin: auto;
    padding: 16px;
    display: flex;

    .alert {
      margin:0;
    }
  }
</style>
