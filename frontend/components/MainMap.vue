<template>
  <div class="main-map">
    <no-ssr>
      <div class="map-wrapper">
        <v-map
          v-if="center"
          :zoom="13"
          :center="center">
          <v-tilelayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"/>
          <v-marker :lat-lng="center"/>
        </v-map>
      </div>
    </no-ssr>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import NoSSR from 'vue-no-ssr';
export default {
    components: {
      'no-ssr': NoSSR
    },
    computed: {
        ...mapState({
            geo: 'geolocation'
        }),
        center() {
            if (this.geo && this.geo.lat && this.geo.lng) {
                return [this.geo.lat, this.geo.lng];
            }
        }
    }
};
</script>

<style lang="less">

.main-map {
    .map-wrapper {
        height: 100vh;
        width: 100%;
    }
}

</style>
