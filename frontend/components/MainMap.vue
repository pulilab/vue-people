<template>
  <div class="main-map">
    <map-toolbar />
    <tag-filter />
    <div
      :class="['map-wrapper', {addMode}]">
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
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'"/>
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

          <map-legend />

          <v-btn
            class="home-button"
            icon
            light
            @click="centerToUser">
            <v-icon>gps_fixed</v-icon>
          </v-btn>
          <l-control-zoom position="bottomright" />
        </l-map>
      </no-ssr>
    </div>
    <v-snackbar
      :timeout="6000"
      :value="addMode"
      color="warning"
      absolute
      bottom
      multi-line
    >
      <v-icon class="mr-2">touch_app</v-icon>
      <span class="body-2">Click on the map anywhere to select your position</span>
    </v-snackbar>

    <v-snackbar
      :timeout="6000"
      :value="centerOnNext"
      color="warning"
      absolute
      bottom
      multi-line
    >
      <v-icon class="mr-2">add_location</v-icon>
      <span class="body-2">...waiting for location</span>
    </v-snackbar>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import MapToolbar from './MapToolbar.vue';
import UserAvatar from './UserAvatar.vue';
import MapLegend from './MapLegend.vue';
import TagFilter from './TagFilter.vue';
import { debounce } from '~/utilities/common';
import VuexGeolocation from 'vuex-geolocation';

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
      mapOptions: { zoomControl: false, attributionControl: false },
      mapBounds: null,
      tooltipOptions: {
        className: 'person-tooltip',
        // set permanent to true to be able to debug / develop the tooltip css
        permanent: false,
        direction: 'top',
        offset: [0, -30]
      },
      centerOnNext: false
    };
  },
  computed: {
    ...mapState({
      userLocation: s => {
        if (s.geolocation) {
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
      getUserType: 'getUserType',
      userProfile: 'user/getUserProfile'
    }),
    userMaker () {
      return this.userPosition;
    },
    shownMarkerCount () {
      if (this.mapBounds && this.pins) {
        let count = this.pins.reduce((prev, c) => {
          const contains = this.mapBounds.contains(L.latLng(c.latlng.lat, c.latlng.lng));
          return contains ? prev + 1 : prev;
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
      handler (loc) {
        if (loc && loc.lat) {
          this.centerToUser();
        }
      }
    },
    shownMarkerCount: {
      immediate: true,
      handler (count) {
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
      setShownPins: 'map/setShownPins'
    }),
    addMarker (event) {
      if (this.addMode) {
        this.setUserPosition(event.latlng);
      }
    },
    openPersonDetails (pin) {
      if (!this.addMode) {
        this.$router.push(`/user/${pin.id}/`);
      }
    },
    mapMoveHandler: debounce(function (e) {
      this.setCenter(e.target.getCenter());
      this.updateBounds();
    }, 200),
    mapZoomHandler: debounce(function (e) {
      this.setZoom(e.target.getZoom());
    }, 200),
    centerToUser () {
      if (!this.$store.state.geolocation) {
        VuexGeolocation.sync(this.$store);
      }
      if (this.$refs.mainMap && this.userLocation && this.userLocation.lat) {
        this.$refs.mainMap.mapObject.flyTo(this.userLocation, 13);
        this.centerOnNext = false;
      } else {
        this.centerOnNext = true;
      }
    },
    mapReady () {
      this.updateBounds();
    },
    updateBounds () {
      this.mapBounds = this.$refs.mainMap.mapObject.getBounds();
    },
    iconGenerator (pin, isMe) {
      if (process.browser) {
        const type = isMe ? 'me' : pin.selected ? 'selected' : this.getUserType(pin.type).name;
        const html = !pin.avatar_url
          ? '<div class="no-icon center-circle"><i aria-hidden="true" class="icon mdi mdi-account-circle"></i></div>'
          : `<img src="${pin.avatar_url}" alt="avatar" class="center-circle" />`;
        const icon = new L.divIcon({ // eslint-disable-line
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
  @import "../assets/style/variables.less";
  @import "../assets/style/mixins.less";

  .main-map {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;

    .map-wrapper {
      position: relative;
      z-index: 2;
      width: 100%;
      height: 100%;

      &.addMode {
        .leaflet-container {
          cursor: pointer;
        }
      }
    }

    .person-tooltip {
      border: none;
      border-radius: 3px;
      background-color: #212121;
      box-shadow: 0 0 6px 0 rgba(0,0,0,0.12), 0 6px 6px 0 rgba(0,0,0,0.24);
    }

    .leaflet-tooltip-left.person-tooltip::before {
      border-left-color: #212121;
    }

    .leaflet-tooltip-right.person-tooltip::before {
      border-right-color: #212121;
    }

    .leaflet-tooltip-bottom.person-tooltip::before {
      border-bottom-color: #212121;
    }

    .leaflet-tooltip-top.person-tooltip::before {
      border-top-color: #212121;
    }

    .custom-pin-icon {
      width: 30px;
      height: 60px;

      .center-circle {
        position: relative;
        top: 3px;
        left: 4px;
        width: 24px;
        height: 24px;
        border-radius: 24px;
        border: 1px solid @color-white;
        box-shadow: 0 2px 2px 0 rgba(0,0,0,.25);
      }

      .no-icon {
        top: 5px;
        left: 5px;
        border: 0;
        background: transparent;
        box-shadow: none;

        i {
          color: @color-white;
          font-size: 22.5px;
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
      bottom: 88px;
      right: 16px;
      z-index: 5000;
      width: 30px;
      height: 30px;
      margin: 0;
      background-color: rgba(255,255,255,.94);
      // elevation-4
      -webkit-box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, .2), 0px 4px 5px 0px rgba(0, 0, 0, .14), 0px 1px 10px 0px rgba(0, 0, 0, .12) !important;
      box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, .2), 0px 4px 5px 0px rgba(0, 0, 0, .14), 0px 1px 10px 0px rgba(0, 0, 0, .12) !important;

      i {
        font-size: 18px;
      }
    }
  }
</style>
