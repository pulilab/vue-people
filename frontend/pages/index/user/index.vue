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
  async fetch ({query, store}) {
    const token = query.token;
    if (token) {
      await store.dispatch('user/setGithubToken', token);
    }
  }
};
</script>

<style>

</style>
