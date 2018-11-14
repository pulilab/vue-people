<template>
  <l-marker
    v-show="showFloatingUi"
    :options="pin.options"
    :lat-lng="pin.latlng"
    :icon="icon"
    @mouseenter="markerHoverHandler(true)"
    @mouseleave="markerHoverHandler(false)"
    @click="emitMarkerClick"
  />
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
    }
  },
  methods: {
    emitMarkerClick () {
      this.$emit('marker-click');
    },
    markerHoverHandler (isEnter) {
      if (isEnter) {
        this.$emit('hover:in', this.pin);
      } else {
        this.$emit('hover:out');
      }
    }
  }
};
</script>

<style lang="less">

    @import "../assets/style/variables.less";
    @import "../assets/style/mixins.less";

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
