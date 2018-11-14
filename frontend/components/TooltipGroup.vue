<template>
  <l-layer-group ref="layerGroup">
    <l-tooltip :options="tooltipOptions">
      <slot
        :instance="instance" />
    </l-tooltip>
  </l-layer-group>
</template>

<script>
export default {
  props: {
    classNames: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      instance: null
    };
  },
  computed: {
    tooltipOptions () {
      return {
        className: `dark-tooltip ${this.classNames}`,
        direction: 'top',
        offset: [0, -55]
      };
    }
  },
  methods: {
    open (instance, latLng) {
      if (latLng) {
        this.instance = instance;
        this.$nextTick(() => {
          this.$refs.layerGroup.mapObject.openTooltip(latLng);
        });
      }
    },
    close () {
      this.$refs.layerGroup.mapObject.closeTooltip();
      this.instance = null;
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

</style>
