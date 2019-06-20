<template>
  <div class="main-map">

    <no-ssr>
      <v-slide-y-transition>
        <map-toolbar v-show="showFloatingUI" />
      </v-slide-y-transition>
    </no-ssr>
    <no-ssr>
      <v-slide-y-transition>
        <tag-filter v-show="showFloatingUI" />
      </v-slide-y-transition>
    </no-ssr>

    <div
      :class="['map-wrapper', {addMode}]">
      <no-ssr>
        <l-map
          ref="mainMap"
          :zoom="zoom"
          :max-zoom="maxZoom"
          :world-copy-jump="true"
          :options="mapOptions"
          @leaflet:load="setMapReady"
          @click="addMarker">
          <l-tilelayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'"
          />
          <tooltip-group ref="tooltipLayer">
            <user-avatar
              :id="instance"
              :dark="true"
              slot-scope="{ instance }"
            />
          </tooltip-group>

          <custom-marker-cluster
            ref="markerCluster"
            :options="clusterOptions"
            :total="pins.length"
          >
            <template v-if="iconsReady">
              <map-marker
                v-for="pin in pins"
                :key="pin.id"
                :pin="pin"
                :icon="getMarkerIcon(pin)"
                :show-floating-ui="showFloatingUI"
                @marker-click="openPersonDetails(pin)"
                @hover:in="tooltipShow"
                @hover:out="tooltipHide"
              />
            </template>
          </custom-marker-cluster>

          <map-marker
            v-if="userMaker.latlng"
            :pin="userMaker"
            :icon="iconGenerator(userProfile, true)"
            :show-floating-ui="showFloatingUI"
            @marker-click="openPersonDetails(userProfile)"
            @hover:in="tooltipShow"
            @hover:out="tooltipHide"
          />

          <meetup-cluster
            :show-floating-ui="showFloatingUI"
          />

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
          <l-control-attribution
            v-if="showFloatingUI"
            position="bottomright"
            prefix="<a target='_blank'
            href='http://leafletjs.com'
            title='A JS library for interactive maps'>Leaflet</a> |
            <span>Powered by:
              <a
                target='_blank'
                href='https://www.esri.com/en-us/home'
              >Esri</a>
            </span>"
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

    <no-ssr>
      <feedback-button v-if="showFloatingUI" />
    </no-ssr>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import MapToolbar from './MapToolbar.vue';
import MapLegend from './MapLegend.vue';
import TagFilter from './TagFilter.vue';
import MapMarker from './MapMarker.vue';
import UserAvatar from './UserAvatar.vue';
import FeedbackButton from './FeedbackButton.vue';
import VuexGeolocation from 'vuex-geolocation';
import MeetupCluster from './MeetupCluster';
import TooltipGroup from './TooltipGroup';

import NoSSR from 'vue-no-ssr';
export default {
  components: {
    'no-ssr': NoSSR,
    MapToolbar,
    MapLegend,
    TagFilter,
    FeedbackButton,
    MapMarker,
    MeetupCluster,
    UserAvatar,
    TooltipGroup
  },
  data () {
    return {
      zoom: 3,
      iconCollection: {},
      centeredToSelected: false,
      mapOptions: { zoomControl: false, attributionControl: false },
      centerOnNext: false,
      iconsReady: false
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
      allPins: 'map/getPins',
      addMode: 'map/isAddMode',
      userPosition: 'user/getUserPosition',
      getUserType: 'getUserType',
      userProfile: 'user/getUserProfile',
      userTypes: 'getUserTypes',
      goToMap: 'getGoToMap',
      currentPerson: 'people/getCurrentPersonDetails',
      firstPageVisited: 'getFirstPageVisited',
      mapReady: 'map/getMapReady'
    }),
    userMaker () {
      return { latlng: this.userPosition };
    },
    maxZoom () {
      return this.addMode ? 13 : 100;
    },
    showFloatingUI () {
      return !((this.$mq === 'sm' || this.$mq === 'xs') && !this.goToMap);
    },
    clusterOptions () {
      return {
        chunkedLoading: true,
        disableClusteringAtZoom: 8,
        spiderfyOnMaxZoom: false,
        maxClusterRadius: zoom => {
          const radiuses = {
            4: 100,
            5: 120,
            6: 110,
            7: 110
          };
          return radiuses[zoom] || 80;
        },
        polygonOptions: {
          stroke: false,
          fillColor: '#42B883'
        },
        iconCreateFunction: cluster => {
          const html = `<span>${cluster.getChildCount()}</span>`;
          return L.divIcon({
            className: `custom-cluster-icon`,
            html,
            iconSize: [48, 52],
            iconAnchor: [24, 52]
          });
        }
      };
    },
    currentPersonAndMapInitialised () {
      if (this.currentPerson && this.mapReady) {
        return this.currentPerson;
      }
      return null;
    }
  },
  watch: {
    userLocation: {
      immediate: true,
      handler (loc) {
        if (loc && loc.lat && this.centerOnNext) {
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
    },
    currentPersonAndMapInitialised: {
      immediate: true,
      handler (current, previous) {
        const currentId = current ? current.id : undefined;
        const previousId = previous ? previous.id : undefined;
        this.recalculateSelectedIcon(currentId, previousId);
        if (currentId) {
          this.centerToSelected(current.latlng);
        }
      }
    }
  },
  mounted () {
    window.requestAnimationFrame(() => {
      this.iconCollection = this.allPins.reduce((p, c) => {
        p[c.id] = this.iconGenerator(c);
        return p;
      }, {});
      this.iconsReady = true;
    });
    this._defaultIcon = new window.L.Icon.Default();
    this.$root.$on('map:center-on', this.centerOn);
  },
  beforeDestroy () {
    this.$root.$off(['map:center-on']);
  },
  methods: {
    ...mapActions({
      setUserPosition: 'user/setUserPosition',
      setMapReady: 'map/setMapReady'
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
    centerOn (latlng) {
      if (this.$refs.mainMap && this.$refs.mainMap.mapObject) {
        this.$refs.mainMap.mapObject.flyTo(latlng, 13);
      }
    },
    iconGenerator (pin, isMe) {
      if (process.browser) {
        const type = isMe ? 'me' : pin.id === this.currentPerson.id ? 'selected' : this.getUserType(pin.type).name;
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
    recalculateSelectedIcon (id, previous) {
      const valid = [id, previous];
      const pins = this.pins.filter(p => valid.includes(p.id));
      pins.forEach(p => {
        this.iconCollection[p.id] = this.iconGenerator(p);
      });
    },
    centerToSelected (latlng) {
      if (this.$refs.mainMap && !this.centeredToSelected && this.firstPageVisited === 'index-user-id') {
        this.$nextTick(() => {
          this.$refs.mainMap.mapObject.flyTo(latlng, 13);
          this.centeredToSelected = true;
        });
      }
    },
    getMarkerIcon (pin) {
      if (process.client) {
        const icon = this.iconCollection[pin.id];
        if (icon) {
          return icon;
        }
        return this._defaultIcon;
      }
    },
    tooltipShow ({id, latlng}) {
      this.$refs.tooltipLayer.open(id, latlng);
    },
    tooltipHide () {
      this.$refs.tooltipLayer.close();
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

    .leaflet-control-attribution {
      position: fixed;
      bottom: 6px;
      right: 0;
    }

    .custom-cluster-icon {
      background-image: url('~/assets/pins/pin-multi3.svg');

       span {
        display: inline-block;
        width: 36px;
        margin-top: 6px;
        font-weight: 800;
        text-align: center;
      }
    }

    .home-button {
      position: fixed;
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

    // Responsive
    .viewport-sm & {
      .home-button {
        bottom: 185px;
      }
    }
  }
</style>
