<template>
  <div class="map-legend elevation-4">
    <user-type
      v-for="type in userTypes"
      :key="type.id"
      :id="type.id"
      :show-text="true"
      @mouseenter.native="legendEnter(type.id)"
      @mouseleave.native="legendLeave"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions} from 'vuex';
import { debounce } from '~/utilities/common';
import UserType from './UserType';

export default {
  components: {
    UserType
  },
  computed: {
    ...mapGetters({
      userTypes: 'getUserTypes'
    }),
  },
  methods: {
    ...mapActions({
      setFocusOn: 'map/setFocusOn',
    }),
    legendEnter: debounce(function(id) {
      this.setFocusOn(id);
    }, 300),
    legendLeave: debounce(function () {
      this.setFocusOn(null);
    }, 300)
  }

};
</script>

<style lang="less">
  @import "../assets/style/variables.less";
  @import "../assets/style/mixins.less";

.map-legend {
  position: absolute;
  bottom: 16px;
  left: 16px;
  z-index: 5000;
  height: @map-card-small-height;
  padding: 0 4px;
  background-color: rgba(255,255,255,.94);
  border-radius: 3px;

  span {
    display: inline-block;
    padding: 0;
    font-family: @font-roboto;
    color: @font-dark-secondary;
    font-size: @font-size-tiny;
    line-height: @map-card-small-height;
    cursor: pointer;
    transition: @default-transition;

    &:hover {
      color: @font-dark-primary;
    }
  }
}

</style>
