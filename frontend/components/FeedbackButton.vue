<template>
  <div class="feedback-button-wrapper">
    <vue-django-feedback
      :name="userProfile.name"
      :email="userProfile.email" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  computed: {
    ...mapGetters({
      userProfile: 'user/getUserProfile'
    })
  }
};
</script>

<style lang="less">
  @import "~vue-django-feedback/dist/styles/main.less";
  @import "~vue-django-feedback/dist/styles/variables.less";

.feedback-button-wrapper {

  vue-django-feedback .vue-django-feedback {
    width: 30px;
    height: 30px;
    bottom: 5px;
    right: 5px;
    z-index: 5;

    .feedback-button {
      min-width: 30px;
      min-height: 30px;
      width: 30px;
      height: 30px;
    }
  }
}

</style>
