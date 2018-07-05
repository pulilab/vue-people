<template>
  <span>

    <span v-show="showText">
      {{ text }}
    </span>

    <span v-show="!showText">
      {{ placeholder }}
    </span>

  </span>
</template>

<script>
export default {
  props: {
    text: {
      type: [String, Number],
      default: null
    },
    placeholder: {
      type: String,
      default: '-'
    }
  },
  computed: {
    showText () {
      return this.text && this.text.length > 0;
    }
  }
};
</script>

<style>

</style>
