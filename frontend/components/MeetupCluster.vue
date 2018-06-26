<template>
  <v-marker-cluster
    :options="clusterOptions"
  >
    <map-marker
      v-for="pin in meetupsGroups"
      :key="pin.id"
      :pin="pin"
      :force-hovered="pin.id === 28760056"
      :icon="iconChooser(pin)"
      :show-floating-ui="showFloatingUi"
      additional-tooltip-class="meetup-tooltip"
      @marker-click="openMeetupDetails(pin.id)"
    >
      <v-layout
        row
      >
        <div class="pic">
          <img :src="pin.group_photo">
          <span> Meetup </span>
        </div>
        <div class="details">
          <div class="title">
            {{ pin.name }}
          </div>
          <div class="date">
            {{ formatTooltipDate(pin) }}
          </div>
        </div>
      </v-layout>
    </map-marker>
  </v-marker-cluster>
</template>

<script>
import { mapGetters } from 'vuex';
import { format } from 'date-fns';
import MapMarker from './MapMarker.vue';

export default {
  components: {
    MapMarker
  },
  props: {
    showFloatingUi: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      meetupIcon: null,
      meetupEventIcon: null,
      meetupIconSelected: null,
      meetupEventIconSelected: null
    };
  },
  computed: {
    ...mapGetters({
      meetupsGroups: 'events/getMeetups',
      currentMeetup: 'events/getCurrentMeetup'
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
  },
  mounted () {
    this.meetupIcon = new L.divIcon({ // eslint-disable-line
      className: `custom-meetup-icon`,
      iconSize: [34, 34],
      iconAnchor: [17, 34]
    });
    this.meetupEventIcon = new L.divIcon({ // eslint-disable-line
      className: `custom-meetup-icon meetup-event`,
      iconSize: [34, 74],
      iconAnchor: [17, 72]
    });
    this.meetupIconSelected = new L.divIcon({ // eslint-disable-line
      className: `custom-meetup-icon meetup-selected`,
      iconSize: [34, 34],
      iconAnchor: [17, 34]
    });
    this.meetupEventIconSelected = new L.divIcon({ // eslint-disable-line
      className: `custom-meetup-icon meetup-event meetup-selected`,
      iconSize: [34, 74],
      iconAnchor: [17, 72]
    });
  },
  methods: {
    openMeetupDetails (id) {
      this.$router.push(`/meetup/${id}/`);
    },
    iconChooser (pin) {
      if (pin.next_event) {
        return this.currentMeetup !== pin.id ? this.meetupEventIcon : this.meetupEventIconSelected;
      }
      return this.currentMeetup !== pin.id ? this.meetupIcon : this.meetupIconSelected;
    },
    formatTooltipDate (pin) {
      if (pin && pin.next_event && pin.next_event.time) {
        const utcTime = pin.next_event.time - pin.next_event.utc_offset;
        return format(utcTime, 'DD MMMM, YYYY');
      }
      return 'No upcoming event';
    }
  }
};
</script>

<style lang="less">
  @import "../assets/style/variables.less";
  @import "../assets/style/mixins.less";

  .meetup-cluster-icon {
    background-image: url('~/assets/pins/pin-meetup-group-small.svg');

    span {
      position: relative;
      top: -5px;
      display: inline-block;
      width: 20px;
      height: 20px;
      margin-top: 0;
      margin-left: 25px;
      font-size: @font-size-tiny - 1;
      line-height: 20px;
      font-weight: 600;
      text-align: center;
      background-color: @color-grey-dark;
      border-radius: 20px;
    }
  }

  .custom-meetup-icon {
    background-image: url('~/assets/pins/pin-meetup-0-small.svg');

    &.meetup-event {
      background-image: url('~/assets/pins/pin-meetup-1-small.svg');

      &.meetup-selected {
        background-image: url('~/assets/pins/pin-meetup-1-small-selected.svg');
      }
    }
    &.meetup-selected {
        background-image: url('~/assets/pins/pin-meetup-0-small-selected.svg');
    }
  }

  .meetup-tooltip {
    color: white;
    padding: 0;

    .pic {
      height: 68px;
      position: relative;

      img {
        height: 100%;
        width: 68px;
      }
      span {
        position: absolute;
        left: 0;
        bottom:0;
        width: 68px;
        background-color: #F64060;
        text-align: center;
      }
    }
  }

</style>
