<template>
  <div>

    <tooltip-group
      ref="tooltipLayer"
      class-names="meetup-tooltip"
    >
      <v-layout
        slot-scope="{ instance }"
        row
        align-center
      >
        <template v-if="instance">
          <div class="logo">
            <img :src="instance.group_photo">
            <span class="m"> Meetup </span>
          </div>
          <div class="details">
            <v-layout
              column
              align-content-center
            >
              <v-flex class="title">
                {{ instance.name }}
              </v-flex>
              <v-flex class="date">
                {{ formatTooltipDate(instance) }}
              </v-flex>
            </v-layout>
          </div>
        </template>
      </v-layout>
    </tooltip-group>

    <custom-marker-cluster
      v-if="showMeetups"
      :options="clusterOptions"
      :total="meetupsGroups.length"
    >
      <map-marker
        v-for="pin in meetupsGroups"
        :key="pin.id"
        :pin="pin"
        :icon="iconChooser(pin)"
        :show-floating-ui="showFloatingUi"
        @marker-click="openMeetupDetails(pin.id)"
        @hover:in="tooltipShow"
        @hover:out="tooltipHide"
      />
    </custom-marker-cluster>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { format } from 'date-fns';
import MapMarker from './MapMarker.vue';
import TooltipGroup from './TooltipGroup';

export default {
  components: {
    MapMarker,
    TooltipGroup
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
      meetupEventIconSelected: null,
      timeZoneOffset: 0
    };
  },
  computed: {
    ...mapGetters({
      meetupsGroups: 'events/getMeetups',
      currentMeetup: 'events/getCurrentMeetup',
      pinFilters: 'map/getPinFilters'
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
    },
    showMeetups () {
      return this.pinFilters.length === 0 || this.pinFilters.includes('meetups');
    }
  },
  mounted () {
    this.meetupIcon = new L.divIcon({ // eslint-disable-line
      className: `custom-meetup-icon`,
      iconSize: [40, 46],
      iconAnchor: [20, 46]
    });
    this.meetupEventIcon = new L.divIcon({ // eslint-disable-line
      className: `custom-meetup-icon meetup-event`,
      iconSize: [34, 52],
      iconAnchor: [17, 52]
    });
    this.meetupIconSelected = new L.divIcon({ // eslint-disable-line
      className: `custom-meetup-icon meetup-selected`,
      iconSize: [40, 46],
      iconAnchor: [20, 46]
    });
    this.meetupEventIconSelected = new L.divIcon({ // eslint-disable-line
      className: `custom-meetup-icon meetup-event meetup-selected`,
      iconSize: [34, 52],
      iconAnchor: [17, 52]
    });

    this.timeZoneOffset = new Date().getTimezoneOffset() * 60000;
  },
  methods: {
    openMeetupDetails (id) {
      this.$router.push(`/meetup/${id}/`);
    },
    iconChooser (pin) {
      if (pin.has_event_with_coords) {
        return this.currentMeetup !== pin.id ? this.meetupEventIcon : this.meetupEventIconSelected;
      }
      return this.currentMeetup !== pin.id ? this.meetupIcon : this.meetupIconSelected;
    },
    formatTooltipDate (pin) {
      if (pin && pin.event && pin.event.date) {
        const date = format(pin.event.local_parsed_time + this.timeZoneOffset, 'dddd, MMMM DD, YYYY');
        return `${date} - ${pin.event.local_time}`;
      }
      return pin.has_event_with_coords ? 'Time not specificed' : 'No upcoming event';
    },
    tooltipShow (pin) {
      this.$refs.tooltipLayer.open(pin, pin.latlng);
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

  .meetup-cluster-icon {
    background-image: url('~/assets/pins/pin-meetup-group-small.svg');

    span {
      position: relative;
      top: -7px;
      display: inline-block;
      min-width: 22px;
      height: 22px;
      margin-top: 0;
      margin-left: 26px;
      padding: 0 4px;
      color: @font-light-primary;
      font-size: @font-size-tiny - 1;
      line-height: 20px;
      font-weight: 600;
      text-align: center;
      border: 1px solid @color-grey-light;
      background-color: @color-grey-dark;
      border-radius: 20px;
    }
  }

  .custom-meetup-icon {
    background-image: url('~/assets/pins/pin-meetup-0-small.svg');

    &.meetup-selected {
        background-image: url('~/assets/pins/pin-meetup-0-small-selected.svg');
    }

    &.meetup-event {
      background-image: url('~/assets/pins/pin-meetup-1-small.svg');

      &.meetup-selected {
        background-image: url('~/assets/pins/pin-meetup-1-small-selected.svg');
      }
    }
  }

  .meetup-tooltip {
    padding: 0;

    .logo {
      position: relative;
      width: 68px;
      height: 68px;
      background: @color-white url('~/assets/images/meetup-nologo.svg') center no-repeat;

      img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: auto;
        height: auto;
        max-width: 58px;
        max-height: 58px;
      }

      span {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 68px;
        font-size: @font-size-tiny - 3;
        font-weight: 600;
        color: @color-white;
        letter-spacing: 1px;
        text-transform: uppercase;
        text-align: center;
        border-radius: 0 0 0 3px;

        &.m {
          background-color: #F64060;
        }

        &.c {
          background-color: @color-brand-primary;
        }
      }
    }

    .details {
      padding: 0 16px 0 16px;
      font-family: @font-roboto;

      .title {
        margin: 2px 0 4px;
        font-size: @font-size-base !important;
        font-weight: 500;
        color: @font-light-primary;
      }

      .date {
        font-size: @font-size-small;
        color: @font-light-disabled;
      }
    }
  }

</style>
