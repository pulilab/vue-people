<template>
  <div :class="['user-type', type.class, 'mx-2']">
    <v-icon small>mdi-vuejs</v-icon>
    <span
      v-show="showText"
      class="ml-1">
      {{ type.name }}
    </span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'UserType',
  props: {
    id: {
      type: Number,
      required: true
    },
    showText: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      getUserType: 'getUserType'
    }),
    type() {
      return this.getUserType(this.id);
    }
  }
};
</script>

<style lang="less">
  .user-type {
    display: inline-block;
    &.dev .icon {
      color:#F5515F;
    }
    &.enthusiast .icon {
      color:#F3881E;
    }
    &.core .icon {
      color:#4A90E2;
    }
  }

</style>
