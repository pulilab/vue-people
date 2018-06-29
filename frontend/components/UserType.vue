<template>
  <div
    :class="['user-type', type.name, 'mx-2']"
    @click="toggleFromName"
  >
    <span
      v-if="showCheckbox"
      class="usertype-checkbox"
    >
      <v-checkbox
        v-model="showThisUsertype"
        hide-details
      />
    </span>
    <v-icon small>mdi-vuejs</v-icon>
    <span
      v-show="showText"
      class="ml-1 user-type-name">
      {{ type.verbose_name }}
    </span>
    <span
      v-show="showCount"
      class="ml-1 user-type-count">
      ({{ type.count }})
    </span>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
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
    },
    showCheckbox: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      getUserType: 'getUserType',
      pinFilters: 'map/getPinFilters'
    }),
    type () {
      return this.getUserType(this.id);
    },
    showThisUsertype: {
      get () {
        return this.pinFilters.includes(this.type.id);
      },
      set () {}
    }
  },
  methods: {
    ...mapActions({
      togglePinFilters: 'map/togglePinFilters'
    }),
    toggleFromName () {
      if (this.$mq !== 'sm' && this.$mq !== 'xs') {
        this.togglePinFilters(this.type.id);
      }
    }
  }
};
</script>

<style lang="less">
  @import "../assets/style/variables.less";
  @import "../assets/style/mixins.less";

  .user-type {
    position: relative;
    display: inline-block;
    cursor: pointer;
    height: @map-card-small-height;
    line-height: @map-card-small-height;

    &.dev .mdi-vuejs {
      color: @color-developer;
    }

    &.enthusiast .mdi-vuejs {
      color: @color-enthusiast;
    }

    &.core .mdi-vuejs {
      color: @color-core-member;
    }

    &.library .mdi-vuejs {
      color: @color-library;
    }

    .mdi-vuejs {
      position: relative;
      top: -1px;
    }

    .usertype-checkbox {
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

    // Responsive
    .viewport-sm & {
      .usertype-checkbox {
        display: none;
      }
    }
  }
</style>
