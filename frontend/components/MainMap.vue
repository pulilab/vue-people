<template>
  <div class="main-map">
    <map-toolbar />
    <div
      class="map-wrapper">
      <no-ssr>
        <l-map
          v-if="center"
          ref="mainMap"
          :zoom="zoom"
          :options="mapOptions"
          :center="center"
          @move="mapMoveHandler"
          @click="addMarker">
          <l-tilelayer
            url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"/>
          <l-marker
            v-for="pin in pins"
            :key="pin.key"
            :options="pin.options"
            :lat-lng="pin.latlng"
            @click="openPersonDetails(pin)"
          >
            <l-tooltip>
              <user-avatar
                :person="pin"
              />
            </l-tooltip>
          </l-marker>

          <l-marker
            v-if="userMaker"
            :lat-lng="userMaker"/>

          <v-btn
            v-if="showCenterToUser"
            class="home-button white"
            icon
            light
            @click="centerToUser">
            <v-icon>gps_fixed</v-icon>
          </v-btn>
          <map-legend />
          <l-control-zoom position="bottomright" />
        </l-map>
      </no-ssr>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState} from 'vuex';
import MapToolbar from './MapToolbar.vue';
import UserAvatar from './UserAvatar.vue';
import MapLegend from './MapLegend.vue';
import { debounce } from '~/utilities/common';

import NoSSR from 'vue-no-ssr';
export default {
  components: {
    'no-ssr': NoSSR,
    MapToolbar,
    UserAvatar,
    MapLegend
  },
  data () {
    return {
      mapOptions: { zoomControl: false , attributionControl: false }
    };
  },
  computed: {
    ...mapState({
      userLocation: s => {
        if(s.geolocation){
          return {lat: s.geolocation.lat, lng: s.geolocation.lng};
        }
      }
    }),
    ...mapGetters({
      pins: 'map/getFilteredPins',
      addMode: 'map/isAddMode',
      userPosition: 'user/getUserPosition',
      zoom: 'map/getZoom',
      center: 'map/getCenter',
      autoCentered: 'map/getAutoCentered'
    }),
    userMaker() {
      return this.userPosition;
    },
    showCenterToUser() {
      return this.userLocation && this.userLocation.lat;
    }
  },
  watch: {
    userLocation: {
      immediate: true,
      handler(loc) {
        this.autoCenter();
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$refs.mainMap.mapObject.whenReady(this.autoCenter.bind(this));
    });
  },
  methods: {
    ...mapActions({
      setUserPosition: 'user/setUserPosition',
      setZoom: 'map/setZoom',
      setCenter: 'map/setCenter',
      setAutoCentered: 'map/setAutoCentered',
    }),
    addMarker(event) {
      if(this.addMode) {
        this.setUserPosition(event.latlng);
      }
    },
    openPersonDetails(pin) {
      this.$router.push(`/user/${pin.id}/`);
    },
    mapMoveHandler: debounce(function(e) {
      this.setZoom(e.target.getZoom());
      this.setCenter(e.target.getCenter());
    }, 200),
    centerToUser() {
      if (this.$refs.mainMap && this.userLocation && this.userLocation.lat) {
        this.$refs.mainMap.mapObject.flyTo(this.userLocation, 13);
        return true;
      }
    },
    autoCenter() {
      if(!this.autoCentered) {
        if (this.centerToUser()) {
          this.setAutoCentered(true);
        }
      }
    }
  }
};
</script>

<style lang="less">

.main-map {
    position: relative;
    width:100%;
    height: 100%;
    z-index: 1;
    .map-wrapper {
        position: relative;
        width:100%;
        height: 100%;
        z-index: 2;
    }

    .home-button {
      position: absolute;
      z-index: 5000;
      bottom: 76px;
      right: 2px;
    }


}

</style>
