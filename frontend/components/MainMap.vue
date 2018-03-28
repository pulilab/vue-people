<template>
  <div class="main-map">
    <div
      class="map-wrapper">
      <no-ssr>
        <v-map
          v-if="center"
          :zoom="13"
          :center="center">
          <v-tilelayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"/>
          <v-marker-cluster>
            <v-marker
              v-for="pin in pins"
              v-if="pin.location"
              :key="pin.id"
              :lat-lng="pin.latlng"/>
          </v-marker-cluster>
        </v-map>
      </no-ssr>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import NoSSR from 'vue-no-ssr';
export default {
    components: {
      'no-ssr': NoSSR
    },
    computed: {
        ...mapState({
            geo: 'geolocation'
        }),
        ...mapGetters({
            pins: 'people/getList'
        }),
        center() {
            if (this.geo && this.geo.lat && this.geo.lng) {
                return [this.geo.lat, this.geo.lng];
            }
        }
    },
    methods: {
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
        width:100%;
        height: 100%;
    }
}

</style>
