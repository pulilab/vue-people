<template>
  <div class="main-map">
    <div
      class="map-wrapper">
      <no-ssr>
        <l-map
          v-if="center"
          :zoom="13"
          :options="mapOptions"
          :center="center"
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
import { mapState, mapGetters, mapActions } from 'vuex';

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
    ...mapState({
      geo: 'geolocation'
    }),
    ...mapGetters({
      pins: 'people/getList',
      addMode: 'map/isAddMode',
      userPosition: 'user/getUserPosition'
    }),
    center() {
      if (this.geo && this.geo.lat && this.geo.lng) {
        return [this.geo.lat, this.geo.lng];
      }
    },
    userMaker() {
      if(this.userPosition) {
        return [this.userPosition.lat, this.userPosition.lng];
      }
    }
  },
  methods: {
    ...mapActions({
      setUserPosition: 'user/setUserPosition'
    }),
    addMarker(event) {
      if(this.addMode) {
        this.setUserPosition(event.latlng);
      }
    },
    openPersonDetails(pin) {
      this.$router.push(`/user/${pin.id}/`);
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
