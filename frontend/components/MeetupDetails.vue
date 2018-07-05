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
            v-if="event"
            :href="event.link"
            target="blank"
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
              v-show="meetup.key_photo"
              :src="meetup.key_photo"
              alt="Meetup cover image"
            >
            <img
              v-show="!meetup.key_photo"
              src="~/assets/images/meetup-nocover.png"
              alt="Meetup cover image placeholder"
            >
          </div>
          <div
            v-show="meetup.group_photo"
            class="meetup-logo elevation-4"
          >
            <img
              :src="meetup.group_photo"
              alt="Meetup logo image"
            >
          </div>
        </div>
        <div class="item group-info px-4 py-4">
          <h3>{{ meetup.name }}</h3>
          <v-layout
            row
            class="content"
          >
            <v-flex>
              <v-icon small>
                location_on
              </v-icon>
              <text-or-placeholder :text="meetup.location" />
            </v-flex>
            <v-flex>
              <v-icon small>group</v-icon>
              <text-or-placeholder :text="meetup.members" />
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
            <span v-show="!showDetails">
              Show details
            </span>
            <span v-show="showDetails">
              Hide details
            </span>
            <v-icon small>arrow_drop_down</v-icon>
          </span>
          <div
            :class="['event-details', 'content', {hidden: !showDetails}]"
            v-html="meetup.description"
          />
        </div>

        <div
          v-if="event && event.name"
          class="item upcoming-event px-4 py-3"
        >
          <div class="caption">
            Next event
          </div>
          <h3>{{ event.name }}</h3>
          <v-layout
            column
            class="content"
          >
            <v-layout align-center>
              <v-flex>
                <v-icon small>access_time</v-icon>
              </v-flex>
              <v-flex>
                <strong>
                  <text-or-placeholder :text="eventDate" />
                </strong>
                <text-or-placeholder :text="eventTimeSpan" />
              </v-flex>
            </v-layout>
            <v-layout align-center>
              <v-flex>
                <v-icon small>location_on</v-icon>
              </v-flex>
              <v-flex v-if="event.venue">
                <strong>Name of the place</strong>
                <text-or-placeholder :text="eventAddress" />
              </v-flex>
            </v-layout>
            <v-layout align-center>
              <v-flex>
                <v-icon small>people</v-icon>
              </v-flex>
              <v-flex>
                <strong>
                  <text-or-placeholder
                    :text="attendess"
                    placeholder="N/A"
                  />
                </strong>
                <span>
                  <text-or-placeholder
                    :text="eventAvailableSpots"
                    placeholder=""
                  />
                </span>
              </v-flex>
            </v-layout>
          </v-layout>
          <span
            :class="['btn-details', { hide: showEventDetails }]"
            @click="toggleEventDetails"
          >
            <span v-show="!showEventDetails">
              Show details
            </span>
            <span v-show="showEventDetails">
              Hide details
            </span>
            <v-icon small>arrow_drop_down</v-icon>
          </span>
          <div
            :class="['event-details', 'content', {hidden: !showEventDetails}]"
            v-html="event.description"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { format } from 'date-fns';
import TextOrPlaceholder from './base/TextOrPlaceholder';

export default {
  components: {
    TextOrPlaceholder
  },
  data () {
    return {
      showDetails: false,
      showEventDetails: false,
      timeZoneOffset: 0
    };
  },
  computed: {
    ...mapGetters({
      currentMeetup: 'events/getCurrentMeetup',
      meetup: 'events/getCurrentMeetupDetails'
    }),
    event () {
      return this.meetup && this.meetup.event;
    },
    eventDate () {
      if (this.event && this.event.local_parsed_time) {
        return format(this.event.local_parsed_time + this.timeZoneOffset, 'dddd, MMMM DD, YYYY');
      }
      return 'No upcoming event';
    },
    eventTimeSpan () {
      if (this.event) {
        const timeFormat = 'HH:mm';
        const startDate = format(this.event.local_parsed_time + this.timeZoneOffset, timeFormat);
        const endDate = format(this.event.local_parsed_time + this.timeZoneOffset + this.event.duration, timeFormat);
        return `${startDate} - ${endDate}`;
      }
    },
    attendess () {
      if (this.event && this.event.yes_rsvp_count) {
        const plural = this.event.yes_rsvp_count === 1 ? 'attendee' : 'attendees';
        return `${this.event.yes_rsvp_count} ${plural}`;
      }
    },
    eventAvailableSpots () {
      if (this.event && this.event.rsvp_limit) {
        const value = this.event.rsvp_limit - this.event.yes_rsvp_count;
        const plural = value === 1 ? 'spot' : 'spots';
        return `${value} ${plural} left`;
      }
    },
    eventAddress () {
      if (this.event && this.event.venue) {
        return `${this.event.venue.address_1}, ${this.event.venue.zip} ${this.event.venue.city}`;
      }
    }
  },
  mounted () {
    this.timeZoneOffset = new Date().getTimezoneOffset() * 60000;
  },
  methods: {
    toggleDetails () {
      this.showDetails = !this.showDetails;
    },
    toggleEventDetails () {
      this.showEventDetails = !this.showEventDetails;
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
            padding: 0 16px 0 12px;
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
        margin-top: 12px;
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

        h3 {
          margin: 0 0 12px;
          font-size: @font-size-base;
        }

        .btn-details {
          display: inline-block;
          margin: 8px 0;
          padding: 4px 4px 4px 8px;
          background-color: darken(@color-brand-secondary, 5%);
          font-size: @font-size-tiny - 2;
          font-weight: 500;
          color: @font-light-secondary;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 4px;

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
          overflow: hidden;
          display: block;
          max-height: auto;
          margin: 12px 0 0;
          opacity: 1;
          word-wrap: break-word;
          transition: opacity 350ms @ease-in-out;

          &.hidden {
            margin: 0;
            max-height: 0;
            opacity: 0;
          }
        }

        &.cover-n-logo {
          position: relative;
          margin-top: 0;
          border: 0;

          .meetup-cover {
            z-index: 20;
            min-height: 101px;
            background-color: darken(@color-brand-secondary, 5%);

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
            background: @color-white url('~/assets/images/meetup-nologo.svg') center no-repeat;
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

          a {
            display: block;
            margin: 8px 0;
            font-size: @font-size-tiny;
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

          strong {
            display: block;
            font-weight: 400;
            color: @color-white;
          }
        }
      }
    }

    // Responsive
    .viewport-sm & {}
  }
</style>
