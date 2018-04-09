<template>
  <div class="pin-count">

    <v-avatar :size="36">
      <v-icon large>person</v-icon>
    </v-avatar>

    {{ count }} Users are shown in the current map

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
  .pin-count {
    position: absolute;
    bottom: 12px;
    left: 12px;
  }
</style>
