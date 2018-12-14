<template>
  <v-toolbar
    class="tag-filter elevation-8 ma-0 pa-0"
    floating
    light
  >
    <v-btn
      icon
      light
      class="open-tag-filter"
      @click="openMenu">
      <v-icon>filter_list</v-icon>
    </v-btn>

    <v-menu
      v-model="dropdownOpen"
      :close-on-content-click="false"
      activator=".tag-filter"
      light
      content-class="menu-tag-filter"
    >
      <v-layout row>
        <v-select
          ref="tagSelect"
          :items="tags"
          v-model="selectedTags"
          label="Type here to filter by tag."
          prepend-icon="search"
          item-text="name"
          light
          solo
          single-line
          autocomplete
          multiple
          class="search-tag-filter"
        />
        <v-btn
          icon
          light
          class="close-tag-filter"
          @click="closeMenu">
          <v-icon>done</v-icon>
        </v-btn>
      </v-layout>
    </v-menu>

    <div
      v-show="showTagsChips"
      class="chips"
    >
      <v-chip
        v-for="tag in selectedTags"
        :key="tag.id"
        close
        @input="removeTag(tag)"
      >
        {{ tag.name }}
      </v-chip>
    </div>
    <div
      v-show="showTagsBadge"
      class="badge">
      {{ selectedTags.length }}
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
    tags () {
      return Array.from(new Set([...this.getSelectedTags, ...this.tagList]));
    },
    selectedTags: {
      get () {
        return this.getSelectedTags;
      },
      set (selected) {
        this.setSelectedTags(selected);
      }
    },
    showTagsBadge () {
      return (this.$mq === 'sm' || this.$mq === 'xs') && this.getSelectedTags && this.getSelectedTags.length > 0;
    },
    showTagsChips () {
      return !this.dropdownOpen && this.selectedTags.length > 0 && !this.showTagsBadge;
    }
  },
  methods: {
    ...mapActions({
      setSelectedTags: 'people/setSelectedTags'
    }),
    openMenu () {
      this.dropdownOpen = true;
      this.$nextTick(() => {
        window.setTimeout(() => {
          this.$refs.tagSelect.focus();
        }, 100);
      });
    },
    closeMenu () {
      this.dropdownOpen = false;
    },
    removeTag (tag) {
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
    min-width: @map-card-height;
    text-align: center;
    border-radius: 3px;
    background-color: rgba(255,255,255,.94) !important;

    .toolbar__content {
      min-width: @map-card-height;
      height: @map-card-height !important;
    }

    .open-tag-filter {
      left: 14px;
      margin: 0 !important;
    }

    .chips {
      margin: 0 16px 0 24px;

      .chip {
        margin: 0 0 0 8px;
      }
    }

    .badge {
      position: relative;
      margin: 0 20px 0 24px !important;
      padding: 0 8px;
      background-color: @color-brand-primary;
      font-size: @font-size-small;
      font-weight: 700;
      color: @color-white;
      border-radius: 3px;
    }
  }

  .search-tag-filter {
    height: @map-card-height;
    border-radius: 3px 3px 0 0 !important;

    label {
      top: 17px !important;
    }

    .input-group__input {
      border-radius: 3px 3px 0 0 !important;

      .icon {
        color: @font-dark-disabled;
      }
    }
  }

  .close-tag-filter {
    position: absolute;
    top: 8px;
    right: 6px;
    display: inline-block;
    color: @color-brand-primary !important;
    background-color: @color-white;
  }

  .menu-tag-filter {
    border-radius: 3px 3px 0 0;

    + .menu__content--dropdown {
      border-radius: 0 0 3px 3px;
      transform: translate(0, -1px);
    }
  }

  // Responsive
  .viewport-sm & {
    .menu-tag-filter,
    .menu-tag-filter + .menu__content--dropdown {
      width: calc(100vw - 32px) !important;
      min-width: calc(100vw - 32px) !important;
      max-width: calc(100vw - 32px) !important;
    }
  }
</style>
