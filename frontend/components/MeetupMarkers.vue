<template>
  <v-marker-cluster
    :options="clusterOptions"
  >
    <l-marker
      v-for="pin in meetupsGroups"
      :key="pin.id"
      :lat-lng="pin.latlng"
    />
  </v-marker-cluster>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  computed: {
    ...mapGetters({
      meetupsGroups: 'events/getMeetups'
    }),
    clusterOptions () {
      return {
        disableClusteringAtZoom: 13,
        spiderfyOnMaxZoom: false,
        polygonOptions: {
          stroke: false,
          fillColor: '#42B883'
        },
        iconCreateFunction: cluster => {
          const html = `<span>${cluster.getChildCount()}</span>`;
          return L.divIcon({
            className: `meetup-cluster-icon`,
            html,
            iconSize: [48, 58],
            iconAnchor: [24, 58]
          });
        }
      };
    }
  }
};
</script>

<style lang="less">
  @import "../assets/style/variables.less";
  @import "../assets/style/mixins.less";

  .meetup-cluster-icon {
    background-image: url('~/assets/pins/pin-meetup-group.svg');

    span {
      position: relative;
      top: -3px;
      display: inline-block;
      width: 20px;
      height: 20px;
      margin-top: 0;
      margin-left: 33px;
      font-size: @font-size-tiny - 1;
      line-height: 20px;
      font-weight: 600;
      text-align: center;
      background-color: @color-grey-dark;
      border-radius: 20px;
    }
  }
</style>
