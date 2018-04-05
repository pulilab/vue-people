<template>
  <div class="avatar-wrapper">
    <v-avatar class="mr-2">
      <v-icon
        v-show="!person.avatarUrl"
        light
      >
        account_circle
      </v-icon>
      <img
        v-show="person.avatarUrl"
        :src="person.avatarUrl" >
    </v-avatar>

    <div
      v-show="person.name">
      <div>{{ person.name }}</div>
      <div> {{ person.email }} </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'UserAvatar',
  props: {
    person: {
      type: Object,
      required: true
    }
  }
};
</script>

<style lang="less">
  .avatar-wrapper {
    width: 100%;
    display: inline-flex;
    align-items: center;
  }

</style>
