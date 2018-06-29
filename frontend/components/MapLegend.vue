<template>
  <div class="map-legend elevation-4">
    <user-type
      v-for="type in userTypes"
      :key="type.id"
      :id="type.id"
      :show-text="calculateShowText(type.id)"
      :show-count="true"
      :show-checkbox="true"
      :class="[{open: type.id === activeType}, 'legend-item']"
      @click.native="setActiveType(type.id)"
    />
    <div
      v-show="!isMobile"
      class="legend-item event-type mx-2"
      @click="toggleMeetupFilter"
    >
      <span class="event-checkbox">
        <v-checkbox
          v-model="showMeetups"
          hide-details
        />
      </span>
      <span class="event-name">Meetups</span>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import UserType from './UserType';

export default {
  components: {
    UserType
  },
  data () {
    return {
      activeType: 2
    };
  },
  computed: {
    ...mapGetters({
      userTypes: 'getUserTypes',
      pinFilters: 'map/getPinFilters'
    }),
    showMeetups: {
      get () {
        return this.pinFilters.includes('meetups');
      },
      set () {}
    },
    isMobile () {
      return this.$mq === 'sm' || this.$mq === 'xs';
    }
  },
  methods: {
    ...mapActions({
      togglePinFilters: 'map/togglePinFilters'
    }),
    calculateShowText (id) {
      return !this.isMobile || this.activeType === id;
    },
    setActiveType (id) {
      this.activeType = id;
    },
    toggleMeetupFilter () {
      this.togglePinFilters('meetups');
    }
  }
};
</script>

<style lang="less">
  @import "../assets/style/variables.less";
  @import "../assets/style/mixins.less";

.map-legend {
  position: fixed;
  bottom: 16px;
  left: 336px;
  z-index: 5000;
  height: @map-card-small-height;
  padding: 0 4px 0 6px;
  background-color: rgba(255,255,255,.94);
  border-radius: 3px;

  .legend-item {
    padding-left: 16px;

    span {
      display: inline-block;
      padding: 0;
      font-family: @font-roboto;
      color: @font-dark-secondary;
      font-size: @font-size-tiny;
    }
  }

  // Meetups, conferences
  .event-type {
    position: relative;
    display: inline-block;
    cursor: pointer;
    height: @map-card-small-height;
    line-height: @map-card-small-height;

    .event-checkbox {
      position: absolute;
      top: -1px;
      left: -6px;
      transform: scale(0.7);

      .icon--selection-control {
        color: @font-dark-disabled;

        &.icon--checkbox {
          color: @font-dark-secondary;
        }
      }
    }

    .event-name {
      margin-left: 2px;
    }
  }

  // Responsive
  .viewport-sm & {
    left: 16px;
    display: flex;
    justify-content: space-around;
    width: calc(100vw - 32px);
    padding: 0;

    .legend-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 38%;
      padding-left: 0;

      span {
        font-size: @font-size-tiny - 1;
        line-height: @map-card-small-height + 1;
        font-weight: 500;
        white-space: nowrap;

        &.user-type-name {
          .text-truncate();
        }
      }

      .mdi-vuejs {
        top: 0;
      }
    }
  }
}

</style>
