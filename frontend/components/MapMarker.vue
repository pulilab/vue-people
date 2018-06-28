<template>
  <l-marker
    v-show="showFloatingUi"
    :options="pin.options"
    :lat-lng="pin.latlng"
    :icon="icon"
    @mouseenter="markerHoverHandler(true, $event)"
    @mouseleave="markerHoverHandler(false, $event)"
    @click="emitMarkerClick"
  >
    <l-tooltip
      v-if="showFloatingUi && hovered || forceHovered"
      :options="tooltipOptions"
    >
      <slot />
    </l-tooltip>
  </l-marker>
</template>

<script>

export default {
  props: {
    pin: {
      type: Object,
      required: true
    },
    icon: {
      type: Object,
      required: false,
      default: () => ({})
    },
    showFloatingUi: {
      type: Boolean,
      required: true
    },
    forceHovered: {
      type: Boolean,
      default: false
    },
    additionalTooltipClass: {
      type: String,
      default: ''
    }
  },
  data () {
    const iconY = this.icon ? -this.icon.options.iconSize[1] - 3 : -55;
    return {
      hovered: false,
      tooltipOptions: {
        className: `dark-tooltip ${this.additionalTooltipClass}`,
        permanent: true,
        direction: 'top',
        offset: [0, iconY]
      }
    };
  },
  methods: {
    emitMarkerClick () {
      this.$emit('marker-click');
    },
    markerHoverHandler (isEnter, event) {
      if (isEnter) {
        this.hovered = true;
        const m = event.target;
        window.setTimeout(() => {
          if (m && !m.isTooltipOpen()) {
            try {
              m.toggleTooltip();
            } catch (e) {
              console.log(e);
            }
          }
        }, 100);
      } else {
        this.hovered = false;
      }
    }
  }
};
</script>

<style lang="less">

    @import "../assets/style/variables.less";
    @import "../assets/style/mixins.less";

    .dark-tooltip {
      border: none;
      border-radius: 3px;
      background-color: @font-dark-primary;
      box-shadow: 0 0 6px 0 rgba(0,0,0,0.12), 0 6px 6px 0 rgba(0,0,0,0.24);
    }

    .leaflet-tooltip-left.dark-tooltip::before {
      border-left-color: @font-dark-primary;
    }

    .leaflet-tooltip-right.dark-tooltip::before {
      border-right-color: @font-dark-primary;
    }

    .leaflet-tooltip-bottom.dark-tooltip::before {
      border-bottom-color: @font-dark-primary;
    }

    .leaflet-tooltip-top.dark-tooltip::before {
      border-top-color: @font-dark-primary;
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
      &.library {
        background-image: url('~/assets/pins/pin-library.svg');
      }
    }

</style>
