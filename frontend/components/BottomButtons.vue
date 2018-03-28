<template>
  <div class="bottom-buttons">
    <v-spacer />
    <v-btn
      class="add-button"
      fab
      color="red">
      <v-icon>add</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
    name: 'BottomButtons'
};
</script>

<style lang="less">
.bottom-buttons {
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 10;
    margin: auto;
    padding: 16px;
    display: flex;

    .add-button {
        width: 55px;
        height: 55px;
    }
}
</style>
