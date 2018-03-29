<template>
  <div class="main-map">
    <div
      class="map-wrapper">
      <no-ssr>
        <l-map
          v-if="center"
          :zoom="zoom"
          :options="mapOptions"
          :center="center"
          @move="mapMoveHandler"
          @click="addMarker">
          <l-tilelayer
            url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"/>
          <l-marker
            v-for="pin in pins"
            :key="pin.id"
            :lat-lng="pin.latlng"
            @click="openPersonDetails(pin)"/>
          <l-marker
            v-if="userMaker"
            :lat-lng="userMaker"/>
        </l-map>
      </no-ssr>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import NoSSR from 'vue-no-ssr';
export default {
  components: {
    'no-ssr': NoSSR
  },
  data () {
    return {
      mapOptions: { zoomControl: false , attributionControl: false }
    };
  },
  computed: {
    ...mapGetters({
      pins: 'people/getList',
      addMode: 'map/isAddMode',
      userPosition: 'user/getUserPosition',
      zoom: 'map/getZoom',
      center: 'map/getCenter'
    }),
    userMaker() {
      return this.userPosition;
    }
  },
  methods: {
    ...mapActions({
      setUserPosition: 'user/setUserPosition',
      setZoom: 'map/setZoom',
      setCenter: 'map/setCenter',
    }),
    addMarker(event) {
      if(this.addMode) {
        this.setUserPosition(event.latlng);
      }
    },
    openPersonDetails(pin) {
      this.$router.push(`/user/${pin.id}/`);
    },
    mapMoveHandler(e) {
      this.setZoom(e.target.getZoom());
      this.setCenter(e.target.getCenter());
    }
  },
};
</script>

<style lang="less">

.main-map {
    position: relative;
    width:100%;
    height: 100%;
    z-index: 1;
    .map-wrapper {
        width:100%;
        height: 100%;
    }
}

</style>
