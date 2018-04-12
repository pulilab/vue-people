<template>
  <v-toolbar
    class="tag-filter elevation-8 ma-0 pa-0"
    floating
    light
  >
    <v-btn
      icon
      light
      class="button-tag-filter"
      @click="openMenu">
      <v-icon>filter_list</v-icon>
    </v-btn>
    <v-menu
      v-model="dropdownOpen"
      :close-on-content-click="false"
      activator=".tag-filter"
      light
    >
      <v-select
        ref="tagSelect"
        :items="tagList"
        v-model="selectedTags"
        label="Select"
        prepend-icon="search"
        light
        solo
        single-line
        clearable
        autocomplete
        multiple
      />
    </v-menu>
    <div class="chips">
      <v-chip
        v-for="tag in selectedTags"
        :key="tag"
        close
        @input="removeTag(tag)"
      >
        {{ tag }}
      </v-chip>
    </div>


  </v-toolbar>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';

export default {
  name: 'TagFilter',
  data () {
    return {
      dropdownOpen: false
    };
  },
  computed: {
    ...mapGetters({
      tagList: 'getTags',
      getSelectedTags: 'people/getSelectedTags'
    }),
    selectedTags: {
      get() {
        return this.getSelectedTags;
      },
      set(selected) {
        this.setSelectedTags(selected);
      }
    },
    showTagsChips() {
      return !this.dropdownOpen && this.selectedTags.length > 0;
    }
  },
  methods: {
    ...mapActions({
      setSelectedTags: 'people/setSelectedTags'
    }),
    openMenu() {
      this.dropdownOpen = !this.dropdownOpen;
      this.$nextTick(() => {
        window.setTimeout(() => {
          this.$refs.tagSelect.focus();
        }, 100);
      });
    },
    removeTag(tag) {
      this.setSelectedTags(this.selectedTags.filter(t => t !== tag));
    }
  }
};
</script>

<style lang="less">
  @import "../assets/style/variables.less";
  @import "../assets/style/mixins.less";

  .tag-filter {
    position: absolute;
    top: 16px;
    left: 16px;
    z-index: 10;
    width: @map-card-height;
    text-align: center;
    border-radius: 2px;
    background-color: rgba(255,255,255,.94) !important;

    .toolbar__content {
      width: @map-card-height;
      height: @map-card-height;
    }

    .button-tag-filter {
      left: 6px;
      width: 36px;
      min-width: 36px;
      height: 36px;
    }
  }
</style>
