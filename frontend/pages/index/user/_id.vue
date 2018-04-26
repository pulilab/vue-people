<template>
  <person-details/>
</template>

<script>
import PersonDetails from '~/components/PersonDetails.vue';

export default {
  components: {
    PersonDetails
  },
  async fetch ({store, params}) {
    await store.dispatch('people/setCurrent', parseInt(params.id, 10));
  },
  mounted () {
    this.$store.dispatch('setGoToMap', false);
  },
  destroyed () {
    this.$store.dispatch('people/setCurrent', null);
    this.$store.dispatch('setGoToMap', true);
  }
};
</script>

<style lang="less">
</style>
