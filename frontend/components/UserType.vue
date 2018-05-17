<template>
  <div :class="['user-type', type.name, 'mx-2']">
    <v-icon small>mdi-vuejs</v-icon>
    <span
      v-show="showText"
      class="ml-1">
      {{ type.verbose_name }}
    </span>
    <span
      v-show="showCount"
      class="ml-1">
      ({{ type.count }})
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
    },
    showCount: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      getUserType: 'getUserType'
    }),
    type () {
      return this.getUserType(this.id);
    }
  }
};
</script>

<style lang="less">
  @import "../assets/style/variables.less";
  @import "../assets/style/mixins.less";

  .user-type {
    display: inline-block;

    &.dev .icon {
      color: @color-developer;
    }

    &.enthusiast .icon {
      color: @color-enthusiast;
    }

    &.core .icon {
      color: @color-core-member;
    }

    i.mdi-vuejs {
      position: relative;
      top: -1px;
    }
  }
</style>
