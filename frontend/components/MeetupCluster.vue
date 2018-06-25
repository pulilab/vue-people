<template>
  <v-marker-cluster
    :options="clusterOptions"
  >
    <l-marker
      v-for="pin in meetupsGroups"
      :key="pin.id"
      :icon="meetupIcon"
      :lat-lng="pin.latlng"
    >
      <l-tooltip
      >
        {{ pin.name }}
      </l-tooltip>
    </l-marker>
  </v-marker-cluster>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  data () {
    return {
      meetupIcon: null
    };
  },
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
            iconAnchor: [24, 29]
          });
        }
      };
    }
  },
  mounted () {
    this.meetupIcon = new L.divIcon({ // eslint-disable-line
      className: `custom-meetup-icon`,
      iconSize: [48, 55],
      iconAnchor: [24, 27.5]
    });
  }
};
</script>

<style lang="less">
.meetup-cluster-icon {
  background-image: url('~/assets/pins/pin-meetup-group.svg');

  span {
    display: inline-block;
    background-color: black;
    border-radius: 1.5em;
    width: 1.5em;
    height: 1.5em;
    margin-top: -5px;
    margin-left: 35px;
    font-weight: 600;
    text-align:center;
  }
}

.custom-meetup-icon {
  background-image: url('~/assets/pins/pin-meetup-0.svg');
}

</style>
