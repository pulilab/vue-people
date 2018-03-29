<template>
  <v-dialog
    v-model="isOpen"
    :transition="false"
    max-width="500px">
    <user-profile-form/>
  </v-dialog>
</template>

<script>
import UserProfileForm from '~/components/UserProfileForm';

export default {
  components: {
    UserProfileForm
  },
  async fetch({query, store}) {
    const code = query.code;
    if ( code ) {
      await store.dispatch('user/gitHubLogin', code);
    }
  },
  data() {
    return {
      isOpen: true
    };
  },
  transition: 'none',
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

<style>

</style>
