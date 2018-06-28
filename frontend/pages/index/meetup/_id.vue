<template>
  <meetup-details />
</template>

<script>
import MeetupDetails from '~/components/MeetupDetails.vue';

export default {
  components: {
    MeetupDetails
  },
  fetch ({store, params}) {
    store.dispatch('events/setCurrent', parseInt(params.id, 10));
  },
  destroyed () {
    this.$store.dispatch('events/setCurrent', null);
  }
};
</script>

<style>

</style>
