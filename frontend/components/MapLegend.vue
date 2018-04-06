<template>
  <div class="map-legend">
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
      console.log('ENTER')
      this.setFocusOn(id);
    }, 300),
    legendLeave: debounce(function () {
      this.setFocusOn(null);
    }, 300)
  }

};
</script>

<style lang="less">

.map-legend {
      position: absolute;
      z-index: 5000;
      bottom: 16px;
      left: 16px;
      opacity: 0.9;
      border-radius: 2px;
      background-color: #FFFFFF;
      box-shadow: 0 0 2px 0 rgba(0,0,0,0.12), 0 2px 2px 0 rgba(0,0,0,0.24);
      padding: 0 9px;

      span {
          display: inline-block;
          color: rgba(0,0,0,0.54);
          font-family: Roboto;
          font-size: 12px;
          line-height: 12px;
          padding: 9px 0;
          cursor: pointer;
      }
    }

</style>
