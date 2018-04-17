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
  destroyed () {
    this.$store.dispatch('people/setCurrent', null);
  }
};
</script>

<style lang="less">
</style>
