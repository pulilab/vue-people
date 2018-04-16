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
  }
};
</script>

<style lang="less">
</style>
