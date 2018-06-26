<template>
  <div class="map-legend elevation-4">
    <user-type
      v-for="type in userTypes"
      :key="type.id"
      :id="type.id"
      :show-text="calculateShowText(type.id)"
      :show-count="true"
      :show-checkbox="true"
      :class="{open: type.id === activeType}"
      @click.native="setActiveType(type.id)"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
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
      userTypes: 'getUserTypes'
    }),
    isMobile () {
      return this.$mq === 'sm' || this.$mq === 'xs';
    }
  },
  methods: {
    calculateShowText (id) {
      return !this.isMobile || this.activeType === id;
    },
    setActiveType (id) {
      this.activeType = id;
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

  .user-type {
    padding-left: 16px;

    span {
      display: inline-block;
      padding: 0;
      font-family: @font-roboto;
      color: @font-dark-secondary;
      font-size: @font-size-tiny;
    }
  }

  // Responsive
  .viewport-sm & {
    left: 16px;
    display: flex;
    justify-content: space-around;
    width: calc(100vw - 32px);
    padding: 0;

    .user-type {
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
    }
  }
}

</style>
