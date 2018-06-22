<template>
  <div class="meetup-details">
    <v-toolbar
      light
      prominent
      extended
      absolute
      class="elevation-4 px-4 pb-4">
      <v-layout align-center>
        <v-flex xs12>
          <v-btn
            light
            flat
            nuxt
            to="/"
            class="btn-back ma-0">
            <v-icon class="mr-1">arrow_back</v-icon>
            back
          </v-btn>
        </v-flex>
        <v-flex>
          <v-btn
            light
            class="btn-center-focus ma-0"
            color="primary"
            @click="centerOnMeetup">
            <v-icon>check</v-icon>
            Attend
          </v-btn>
        </v-flex>
      </v-layout>
    </v-toolbar>
    <div class="meetup-info-container">
      <div
        v-if="meetup"
        class="meetup-info">
        <div class="item px-4 py-3">
          <v-layout row>
            Pic
          </v-layout>
        </div>
        <div class="item px-4 py-3">
          Group data
        </div>
        <div class="item px-4 py-3">
          latest events
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  components: {
  },
  computed: {
    ...mapGetters({
      meetup: 'events/getCurrentMeetup'
    })
  },
  methods: {}

};
</script>

<style lang="less">
  @import "../assets/style/variables.less";
  @import "../assets/style/mixins.less";

  .meetup-details {
    position: relative;
    width: 100%;
    background-color: @color-brand-secondary;

    .toolbar {
      background-color: @color-white !important;

      .toolbar__content {
        .btn {
          &:not(.btn--icon) {
            min-width: 0;
            margin: 0;
            padding: 0 10px 0 6px;

            .btn__content {
              padding: 0;
            }
          }
        }
      }
    }

    .meetup-info-container {
      position: relative;
      height: calc(100% - 216px);
      top: 152px;
      width: 100%;
      max-width: 100%;
      overflow-y: auto;
      overflow-x: hidden;

      .meetup-info {
        position: relative;

        .btn {
          min-width: 0;
          margin: 0 12px 0 0;
          padding: 0;

          .btn__content {
            padding: 0 8px;
            font-size: @font-size-tiny;
            font-weight: 400;
            text-transform: none;
          }
        }
      }

      .item {
        border-bottom: 1px solid @font-light-dividers;

        .content {
          flex-wrap: wrap;
          font-size: @font-size-tiny;
        }
      }
    }

    // Responsive
    .viewport-sm & {
      .btn-center-focus {
        display: none;
      }
    }
  }
</style>
