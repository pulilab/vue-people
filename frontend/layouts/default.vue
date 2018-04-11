<template>
  <v-app
    class="vue-people"
    dark>
    <v-content>
      <nuxt/>
    </v-content>
  </v-app>
</template>

<style lang="less">
  @import "../assets/style/variables.less";
  @import "../assets/style/mixins.less";

  .vue-people {
    height: 100vh;

    .content {
      height: 100%;
    }
  }
</style>
