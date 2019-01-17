<template>
  <div class="feedback-button-wrapper">
    <vue-django-feedback
      v-if="csrfToken"
      :name="userProfile.name"
      :email="userProfile.email"
      :csrf-token="csrfToken" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  computed: {
    ...mapGetters({
      userProfile: 'user/getUserProfile',
      csrfToken: 'user/getCsrfToken'
    })
  }
};
</script>

<style lang="less">
  @import "~vue-django-feedback/dist/styles/variables.less";
  @import "~vue-django-feedback/dist/styles/main.less";
  @import "../assets/style/variables.less";

  .feedback-button-wrapper {

    vue-django-feedback .vue-django-feedback {
      z-index: 5000;
      bottom: 22px;
      right: 16px;
      width: 30px;
      height: 30px;
      padding: 0 !important;

      .feedback-button {
        width: 30px;
        height: 30px;
        min-width: 30px;
        min-height: 30px;
        background-color: fade(@color-brand-primary, 94%);
        // elevation-4
        box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, .2), 0px 4px 5px 0px rgba(0, 0, 0, .14), 0px 1px 10px 0px rgba(0, 0, 0, .12) !important;

        .icon.icon-opened {
          > span {
            color: @color-white;
          }

          &::before,
          &::after {
            display: none;
          }
        }
      }

      .hint-container {
        bottom: -6px;
        right: 56px;
        padding: 6px 12px;
        min-height: 48px;

        &::after {
          bottom: 13px;
        }
      }

      .pop-up-container {
        bottom: 46px;
        max-height: calc(100vh - 78px);

        .header {
          background-color: @color-brand-primary;

          .icon.icon-opened {
            > span {
              color: @color-brand-primary;
            }
          }
        }

        .message-container {
          padding: @vdf-padding/2 @vdf-padding;

          h4 {
            margin-bottom: 12px;
            font-size: @vdf-base-font;
            border-color: transparent !important;
            background-color: transparent !important;

            &.error {
              color: @color-error;
            }
          }

          p {
            font-size: @vdf-base-font - 2;
            line-height: 1.5;
          }
        }
      }

      .pop-up-controls {
        .actions {
          button {
            color: @color-brand-primary;
          }
        }
      }

      .input-container {
        .feedback {
          .error {
            color: @color-error !important;
            border-color: transparent !important;
            background-color: transparent !important;
          }
        }
      }

      // Responsive
      .viewport-sm & {
        bottom: 62px;

        .feedback-button {
          &:hover {
            transform: none;
          }
        }

        .hint-container {
          display: none;
        }

        .pop-up-container {
          width: calc(100vw - 32px);
          max-height: calc(100vh - 123px);

          .header {
            width: calc(100vw - 32px);
          }

          .form-container {
            padding: @vdf-padding/2;
          }
        }

        .pop-up-controls {
          width: calc(100vw - 32px);
          padding: 0 @vdf-padding/2;
        }

        .message-container {
          padding: @vdf-padding/2;
        }
      }
    }
  }
</style>
