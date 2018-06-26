<template>
  <div class="meetup-details">
    <v-toolbar
      light
      prominent
      extended
      absolute
      class="elevation-4 px-4">
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
            class="btn-attend ma-0"
            color="primary"
          >
            <v-icon class="mr-1">check</v-icon>
            Attend
          </v-btn>
        </v-flex>
      </v-layout>
    </v-toolbar>
    <div class="meetup-info-container">
      <div
        v-if="meetup"
        class="meetup-info">
        <div class="item cover-n-logo">
          <div class="meetup-cover">
            <img
              :src="meetup.key_photo"
              alt="Meetup cover image"
            >
          </div>
          <div class="meetup-logo elevation-4">
            <img
              :src="meetup.group_photo"
              alt="Meetup logo image"
            >
          </div>
        </div>
        <div class="item group-info px-4 py-4">
          <h5>{{ meetup.name }}</h5>
          <v-layout
            row
            class="content"
          >
            <v-flex>
              <v-icon small>
                location_on
              </v-icon>
              {{ meetup.location }}
            </v-flex>
            <v-flex>
              <v-icon small>group</v-icon>
              {{ meetup.members }}
            </v-flex>
          </v-layout>
          <a
            :href="meetup.link"
            target="_blank">Visit group on meetup.com
          </a>

          <span
            :class="['btn-details', { hide: showDetails }]"
            @click="toggleDetails"
          >
            Show details <!-- Hide details -->
            <v-icon small>arrow_drop_down</v-icon>
          </span>
          <div
            :class="['event-details', 'content', {hidden: !showDetails}]"
          >
            <p>Lorem ipsum dolor sit amet, consectetur adipisici elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Fictum,  deserunt mollit anim laborum astutumque! Sed haec quis possit intrepidus aestimare tellus.</p>
            <p>A communi observantia non est recedendum. Plura mihi bona sunt, inclinet, amari petere vellent. Nihil hic munitissimus habendi senatus locus, nihil horum?</p>
            <p>Etiam habebis sem dicantur magna mollis euismod. Hi omnes lingua, institutis, legibus inter se differunt. Paullum deliquit, ponderibus modulisque suis ratio utitur. Prima luce, cum quibus mons aliud  consensu ab eo. Morbi odio eros, volutpat ut pharetra vitae, lobortis sed nibh. Me non paenitet nullum festiviorem excogitasse ad hoc.</p>
          </div>
        </div>

        <div
          v-if="meetup.next_event"
          class="item upcoming-event px-4 py-3"
        >
          <div class="caption">
            Upcoming events
          </div>
          <h3>{{ meetup.next_event.name }}</h3>
          <v-layout
            column
            class="content"
          >
            <v-layout align-center>
              <v-flex>
                <v-icon small>access_time</v-icon>
              </v-flex>
              <v-flex>
                <strong>Tuesday, June 26, 2018</strong>
                6:30PM - 9:00PM
              </v-flex>
            </v-layout>
            <v-layout align-center>
              <v-flex>
                <v-icon small>location_on</v-icon>
              </v-flex>
              <v-flex>
                <strong>Name of the place</strong>
                Paulay Ede u. 12., Ground floor, Budapest
              </v-flex>
            </v-layout>
            <v-layout align-center>
              <v-flex>
                <v-icon small>people</v-icon>
              </v-flex>
              <v-flex>
                <strong>165 attendees</strong>
                <span>15 spots left</span>
              </v-flex>
            </v-layout>
          </v-layout>
          <!-- TODO -->
          <!-- Toggle class 'show/hide' on button -->

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
  data () {
    return {
      showDetails: false
    };
  },
  computed: {
    ...mapGetters({
      currentMeetup: 'events/getCurrentMeetup',
      meetup: 'events/getCurrentMeetupDetails'
    })
  },
  methods: {
    toggleDetails () {
      this.showDetails = !this.showDetails;
    }
  }

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

          &.btn-attend {
            color: @color-white;
          }
        }
      }

      .toolbar__extension {
        display: none;
      }
    }

    .meetup-info-container {
      position: relative;
      height: calc(100% - 128px);
      top: 64px;
      width: 100%;
      max-width: 100%;
      overflow-y: auto;
      overflow-x: hidden;

      .meetup-info {}

      .item {
        border-bottom: 1px solid @font-light-dividers;

        .caption {
          margin-bottom: 12px;
          font-weight: 500;
          text-transform: uppercase;
          color: @font-light-disabled;
        }

        .content {
          flex-wrap: wrap;
          font-size: @font-size-tiny;
          color: @font-light-secondary;

          .icon {
            position: relative;
            top: -1px;
            left: -2px;
            color: @font-light-secondary;
          }
        }

        &.cover-n-logo {
          position: relative;
          border: 0;

          .meetup-cover {
            z-index: 20;

            img {
              display: block;
              width: 100%;
              height: auto;
            }
          }

          .meetup-logo {
            z-index: 30;
            position: absolute;
            left: 24px;
            bottom: -14px;
            display: block;
            width: 60px;
            height: 60px;
            background-color: @color-white;
            border-radius: 3px;

            img {
              width: 52px;
              height: 52px;
              margin: 4px;
              border-radius: 2px;
            }
          }
        }

        &.group-info {
          .flex {
            flex-grow: 0;
            padding-right: 20px;
          }

          h5 {
            margin: 8px 0;
            font-size: @font-size-small;
          }

          a {
            display: block;
            margin: 8px 0 0;
            font-size: @font-size-tiny;
          }

          .btn-details {
            display: block;
            margin: 8px 0;
            font-size: @font-size-tiny;
            color: @font-light-secondary;
            cursor: pointer;

            .icon {
              position: relative;
              top: -1px;
              color: @font-light-secondary;
            }

            &.hide {
              .icon {
                transform: rotate(180deg);
              }
            }
          }

          .event-details {
            margin: 12px 0;
          }
        }

        &.upcoming-event {
          .content {
            .layout {
              margin: 0 0 12px;

              .flex {
                flex-grow: 0;
                padding-right: 12px;
              }
            }
          }

          h3 {
            margin: 0 0 12px;
          }

          strong {
            display: block;
            font-weight: 400;
            color: @color-white;
          }

        }
      }
    }

    // Responsive
    .viewport-sm & {
    }
  }
</style>
