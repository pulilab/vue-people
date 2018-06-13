<template>
  <div class="main-map">

    <v-slide-y-transition>
      <map-toolbar v-show="showFloatingUI" />
    </v-slide-y-transition>
    <v-slide-y-transition>
      <tag-filter v-show="showFloatingUI" />
    </v-slide-y-transition>

    <div
      :class="['map-wrapper', {addMode}]">
      <no-ssr>
        <l-map
          v-if="center"
          ref="mainMap"
          :zoom="zoom"
          :max-zoom="maxZoom"
          :world-copy-jump="true"
          :options="mapOptions"
          :center="center"
          @moveend="mapMoveHandler"
          @zoomend="mapZoomHandler"
          @click="addMarker">
          <l-tilelayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'"/>

          <v-marker-cluster :options="clusterOptions">
            <l-marker
              v-for="pin in pins"
              v-show="showFloatingUI"
              :key="pin.key"
              :options="pin.options"
              :lat-lng="pin.latlng"
              :icon="iconGenerator(pin)"
              @mouseenter="markerHoverHandler(pin, $event)"
              @click="openPersonDetails(pin)"
            >
              <l-tooltip
                v-if="showFloatingUI && hoveredMarker === pin.id"
                :options="tooltipOptions"
              >
                <user-avatar
                  :id="pin.id"
                  :dark="true"
                />
              </l-tooltip>
            </l-marker>
          </v-marker-cluster>

          <l-marker
            v-if="userMaker"
            v-show="showFloatingUI"
            :lat-lng="userMaker"
            :icon="iconGenerator(userProfile, true)"
            @click="openPersonDetails(userProfile)">
            <l-tooltip
              v-if="showFloatingUI"
              :options="tooltipOptions"
            >
              <user-avatar
                :dark="true"
              />
            </l-tooltip>
          </l-marker>

          <map-legend
            v-show="showFloatingUI"
          />

          <v-btn
            v-show="showFloatingUI"
            class="home-button"
            icon
            light
            @click="centerToUser">
            <v-icon>gps_fixed</v-icon>
          </v-btn>
          <l-control-zoom
            v-if="showFloatingUI"
            position="bottomright"
          />
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
      <v-icon class="mr-3">pin_drop</v-icon>
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
      <div>
        <v-icon class="mr-3">my_location</v-icon>
        <span class="body-2">...waiting for location</span>
      </div>
    </v-snackbar>

    <feedback-button v-if="showFloatingUI" />
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import MapToolbar from './MapToolbar.vue';
import UserAvatar from './UserAvatar.vue';
import MapLegend from './MapLegend.vue';
import TagFilter from './TagFilter.vue';
import FeedbackButton from './FeedbackButton.vue';
import { debounce } from '~/utilities/common';
import VuexGeolocation from 'vuex-geolocation';

import NoSSR from 'vue-no-ssr';
export default {
  components: {
    'no-ssr': NoSSR,
    MapToolbar,
    UserAvatar,
    MapLegend,
    TagFilter,
    FeedbackButton
  },
  data () {
    return {
      mapOptions: { zoomControl: false, attributionControl: false },
      tooltipOptions: {
        className: 'person-tooltip',
        // set permanent to true to be able to debug / develop the tooltip css
        permanent: false,
        direction: 'top',
        offset: [0, -55]
      },
      hoveredMarker: null,
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
      storedZoom: 'map/getZoom',
      center: 'map/getCenter',
      getUserType: 'getUserType',
      userProfile: 'user/getUserProfile',
      userTypes: 'getUserTypes',
      goToMap: 'getGoToMap'
    }),
    userMaker () {
      return this.userPosition;
    },
    showFloatingUI () {
      return !((this.$mq === 'sm' || this.$mq === 'xs') && !this.goToMap);
    },
    maxZoom () {
      return this.addMode ? 13 : undefined;
    },
    zoom () {
      if (this.maxZoom) {
        return this.storedZoom > this.maxZoom ? this.maxZoom : this.storedZoom;
      }
      return this.storedZoom;
    },
    clusterOptions () {
      return {
        polygonOptions: {
          stroke: false,
          fillColor: '#42B883'
        },
        iconCreateFunction: cluster => {
          const html = `<span>${cluster.getChildCount()}</span>`;
          return L.divIcon({
            className: `custom-cluster-icon`,
            html,
            iconSize: [36, 52],
            iconAnchor: [18, 52]
          });
        } };
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
    goToMap: {
      immdiate: false,
      handler (showMap) {
        if (showMap) {
          setTimeout(() => {
            this.$refs.mainMap.mapObject.invalidateSize();
          }, 400);
        }
      }
    }
  },
  methods: {
    ...mapActions({
      setUserPosition: 'user/setUserPosition',
      setZoom: 'map/setZoom',
      setCenter: 'map/setCenter'
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
    }, 200),
    mapZoomHandler: debounce(function (e) {
      const value = parseInt(e.target.getZoom(), 10);
      this.setZoom(value);
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
    iconGenerator (pin, isMe) {
      if (process.browser) {
        const type = isMe ? 'me' : pin.selected ? 'selected' : this.getUserType(pin.type).name;
        const html = !pin.avatar_url
          ? '<div class="no-icon center-circle"><i aria-hidden="true" class="icon mdi mdi-account-circle"></i></div>'
          : `<img src="${pin.avatar_url}" alt="avatar" class="center-circle" />`;
        const icon = new L.divIcon({ // eslint-disable-line
          className: `custom-pin-icon ${type}`,
          html,
          iconSize: [33, 52],
          iconAnchor: [16.5, 52]
        });
        return icon;
      }
    },
    markerHoverHandler (pin, event) {
      this.hoveredMarker = pin.id;
      const m = event.target;
      window.setTimeout(() => {
        if (!m.isTooltipOpen()) {
          m.toggleTooltip();
        }
      }, 300);
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

      // Ugly fix to avoid uninitialised tooltip to appear under the map
      .vue2leaflet-map {
        .avatar-wrapper {
          opacity: 0
        }
        .leaflet-pane {
          .avatar-wrapper {
            opacity: 1
          }
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

    .custom-cluster-icon {
      background-image: url('~/assets/pins/pin-multi.svg');

      span {
        display: inline-block;
        width: 36px;
        margin-top: 6px;
        font-weight: 600;
        text-align: center;
      }
    }

    .home-button {
      position: absolute;
      bottom: 139px;
      right: 16px;
      z-index: 5000;
      width: 30px;
      height: 30px;
      margin: 0;
      background-color: rgba(255,255,255,.94);
      // elevation-4
      box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, .2), 0px 4px 5px 0px rgba(0, 0, 0, .14), 0px 1px 10px 0px rgba(0, 0, 0, .12) !important;

      i {
        font-size: 18px;
      }
    }
  }
</style>
