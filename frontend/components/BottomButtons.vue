<template>

  <div
    class="bottom-buttons">
    <v-spacer />
    <v-slide-y-transition>
      <v-btn
        v-show="showGoToAddPerson"
        class=""
        fab
        large
        color="primary"
        @click="confirmMarkerPosition">
        <v-icon>check</v-icon>
      </v-btn>
    </v-slide-y-transition>
    <v-slide-y-transition>
      <v-btn
        v-show="showAddMarkerButton"
        class=""
        fab
        large
        color="red"
        @click="setAddMode(true)">
        <v-icon>add</v-icon>
      </v-btn>
    </v-slide-y-transition>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
export default {
  name: 'BottomButtons',
  computed: {
    ...mapGetters({
      addMode: 'map/isAddMode',
      isUserPositionSet: 'user/isPositionSet',
      isLoggedIn: 'user/getLoginStatus'
    }),
    showGoToAddPerson () {
      return this.addMode && this.isUserPositionSet;
    },
    showAddMarkerButton () {
      return !this.addMode && this.isLoggedIn && !this.isUserPositionSet;
    }
  },
  methods: {
    ...mapActions({
      setAddMode: 'map/setAddMode'
    }),
    confirmMarkerPosition () {
      this.setAddMode(false);
    }
  }
};
</script>

<style lang="less">
.bottom-buttons {
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 10;
    margin: auto;
    padding: 16px;
    display: flex;
}
</style>
