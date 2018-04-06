<template>
  <div>
    <user-profile-form/>
  </div>
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
  }
};
</script>

<style>

</style>
