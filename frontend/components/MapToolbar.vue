<template>
  <v-toolbar
    class="map-toolbar"
    floating
    light
  >
    <user-menu />
  </v-toolbar>
</template>

<script>
import UserMenu from './UserMenu.vue';
export default {
  name: 'MapToolabar',
  components: {
    UserMenu
  }
};
</script>

<style lang="less">
  .map-toolbar {
    position: absolute;
    top: 16px;
    right: 0;
    z-index: 10;
  }
</style>
