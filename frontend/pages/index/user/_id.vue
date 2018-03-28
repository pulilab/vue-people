<template>
  <v-dialog
    v-model="isOpen"
    :hide-overlay="true"
    content-class="left-dialog"
    transition="dialog-bottom-transition"
    persistent>
    <person-details/>
  </v-dialog>
</template>

<script>
import PersonDetails from '~/components/PersonDetails.vue';

export default {
  components: {
    PersonDetails
  },
  data() {
    return {
      isOpen: true
    };
  },
  transition: 'none',
  async fetch({store, params}) {
    await store.dispatch('people/setCurrent', parseInt(params.id, 10));
  },
  watch: {
    isOpen: {
      immediate: true,
      handler(isOpen) {
        if (!isOpen) {
          this.$router.push('/');
        }
      }
    }
  }
};
</script>

<style lang="less">
.dialog.left-dialog {
  max-height: 100%;
  width:40%;
  margin: 0;
  margin-left: -60%;

  .dialog-container {
    height: 100%;
  }
}
</style>

