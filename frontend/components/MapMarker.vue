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
      v-if="showFloatingUi && hovered"
      :options="tooltipOptions"
    >
      <user-avatar
        :id="pin.id"
        :dark="true"
      />
    </l-tooltip>
  </l-marker>
</template>

<script>
import UserAvatar from './UserAvatar.vue';

export default {
  components: {
    UserAvatar
  },
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
  data () {
    return {
      hovered: false,
      tooltipOptions: {
        className: 'person-tooltip',
        permanent: false,
        direction: 'top',
        offset: [0, -55]
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
            m.toggleTooltip();
          }
        }, 100);
      } else {
        this.hovered = false;
      }
    }
  }
};
</script>

<style>

</style>
