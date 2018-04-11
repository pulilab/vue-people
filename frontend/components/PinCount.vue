<template>
  <div class="pin-count pa-4">
    <div>
      <v-avatar :size="40">
        <v-icon>account_circle</v-icon>
      </v-avatar>
    </div>

    <div class="counter">
      <b>{{ count }} users</b>
      <small>are shown in the current map</small>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'PinCount',
  computed: {
    ...mapGetters({
      count: 'map/getShownPins'
    })
  }
};
</script>

<style lang="less">
  @import "../assets/style/variables.less";
  @import "../assets/style/mixins.less";

  .pin-count {
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;

    .avatar {
      .icon {
        font-size: 48px;
        color: @font-light-disabled;
      }
    }

    .counter {
      padding: 0 12px;

      b {
        display: block;
      }

      small {
        font-size: @font-size-tiny;
        color: @font-light-disabled;
      }
    }
  }
</style>
