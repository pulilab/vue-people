<template>
  <div class="main-map">
    <map-toolbar />
    <tag-filter />
    <div
      class="map-wrapper">
      <no-ssr>
        <l-map
          v-if="center"
          ref="mainMap"
          :zoom="zoom"
          :options="mapOptions"
          :center="center"
          @moveend="mapMoveHandler"
          @zoomend="mapZoomHandler"
          @click="addMarker">
          <l-tilelayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
          <l-marker
            v-for="pin in pins"
            :key="pin.key"
            :options="pin.options"
            :lat-lng="pin.latlng"
            :icon="iconGenerator(pin)"
            @click="openPersonDetails(pin)"
          >
            <l-tooltip :options="tooltipOptions">
              <user-avatar
                :id="pin.id"
                :dark="true"
              />
            </l-tooltip>
          </l-marker>

          <l-marker
            v-if="userMaker"
            :lat-lng="userMaker"
            :icon="iconGenerator(userProfile, true)"
            @click="openPersonDetails(userProfile)">
            <l-tooltip :options="tooltipOptions">
              <user-avatar
                :dark="true"
              />
            </l-tooltip>
          </l-marker>

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
import TagFilter from './TagFilter.vue';
import { debounce } from '~/utilities/common';

import NoSSR from 'vue-no-ssr';
export default {
  components: {
    'no-ssr': NoSSR,
    MapToolbar,
    UserAvatar,
    MapLegend,
    TagFilter
  },
  data () {
    return {
      mapOptions: { zoomControl: false , attributionControl: false },
      mapBounds: null,
      tooltipOptions: {
        className: 'person-tooltip',
        // set permanent to true to be able to debug / develop the tooltip css
        permanent: false
      }
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
      autoCentered: 'map/getAutoCentered',
      getUserType: 'getUserType',
      userProfile: 'user/getUserProfile'
    }),
    userMaker() {
      return this.userPosition;
    },
    showCenterToUser() {
      return this.userLocation && this.userLocation.lat;
    },
    shownMarkerCount() {
      if (this.mapBounds && this.pins) {
        let count = this.pins.reduce((prev, c) => {
          const contains = this.mapBounds.contains(L.latLng(c.latlng.lat, c.latlng.lng));
          return contains ? prev += 1 : prev;
        }, 0);
        if (this.userPosition && this.mapBounds.contains(L.latLng(this.userPosition))) {
          return count + 1;
        }
        return count;
      }
      return 0;
    }
  },
  watch: {
    userLocation: {
      immediate: true,
      handler(loc) {
        this.autoCenter();
      }
    },
    shownMarkerCount: {
      immediate: true,
      handler(count) {
        // this is to update VUEX consequently
        this.setShownPins(count);
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$refs.mainMap.mapObject.whenReady(this.mapReady.bind(this));
    });
  },
  methods: {
    ...mapActions({
      setUserPosition: 'user/setUserPosition',
      setZoom: 'map/setZoom',
      setCenter: 'map/setCenter',
      setAutoCentered: 'map/setAutoCentered',
      setShownPins: 'map/setShownPins'
    }),
    addMarker(event) {
      if(this.addMode) {
        this.setUserPosition(event.latlng);
      }
    },
    openPersonDetails(pin) {
      if (!this.addMode) {
        this.$router.push(`/user/${pin.id}/`);
      }
    },
    mapMoveHandler: debounce(function(e) {
      this.setCenter(e.target.getCenter());
      this.updateBounds();
    }, 200),
    mapZoomHandler: debounce(function(e) {
      this.setZoom(e.target.getZoom());
    }, 200),
    centerToUser() {
      if (this.$refs.mainMap && this.userLocation && this.userLocation.lat) {
        this.$refs.mainMap.mapObject.flyTo(this.userLocation, 13);
        return true;
      }
    },
    mapReady() {
      this.autoCenter();
      this.updateBounds();
    },
    autoCenter() {
      if(!this.autoCentered) {
        if (this.centerToUser()) {
          this.setAutoCentered(true);
        }
      }
    },
    updateBounds() {
      this.mapBounds = this.$refs.mainMap.mapObject.getBounds();
    },
    iconGenerator(pin, isMe) {
      if (process.browser) {
        const type = isMe ? 'me' : pin.selected ? 'selected' : this.getUserType(pin.type).class;
        const html = !pin.avatarUrl ?
          '<div class="no-icon center-circle"><i aria-hidden="true" class="icon mdi mdi-account-circle"></i></div>'
          : `<img src="${pin.avatarUrl}" alt="avatar" class="center-circle" />`;
        const icon = new L.divIcon({
          className: `custom-pin-icon ${type}`,
          html,
          iconSize: [33, 52]
        });
        return icon;
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

    .person-tooltip {
      border-radius: 4px;
      border: none;
	    background-color: #323232;
      box-shadow: 0 0 6px 0 rgba(0,0,0,0.12), 0 6px 6px 0 rgba(0,0,0,0.24);

    }

    .leaflet-tooltip-left.person-tooltip::before {
      border-left-color: #323232;;
    }
    .leaflet-tooltip-right.person-tooltip::before {
      border-right-color: #323232;;
    }

    .custom-pin-icon {
      width: 30px;
      height: 60px;

      .center-circle {
        position: relative;
        width: 26px;
        height: 26px;
        border-radius: 25px;
        left: 3px;
        top: 2px;
      }

      .no-icon {
        background: #FFF;

        i {
          color: #000;
          font-size: 26px;
          position: relative;
          left: 0.5px;
        }
      }

      &.dev {
        background-image: url('~/assets/pins/pin-dev.svg');
      }
      &.core {
        background-image: url('~/assets/pins/pin-core.svg');
      }
      &.enthusiast {
        background-image: url('~/assets/pins/pin-enthusiast.svg');
      }
      &.selected {
        background-image: url('~/assets/pins/pin-selected.svg');
      }
      &.me {
        background-image: url('~/assets/pins/pin-me.svg');
      }
    }

    .home-button {
      position: absolute;
      z-index: 5000;
      bottom: 76px;
      right: 2px;
    }


}

</style>
