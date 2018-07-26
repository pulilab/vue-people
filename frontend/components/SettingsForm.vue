<template>
  <v-card light>
    <v-card-title class="headline">Settings</v-card-title>
    <v-card-text>
      <v-container grid-list-md>
        <v-layout wrap>
          <v-flex xs12>
            <v-checkbox
              v-model="settings.websocket"
              label="Activate real time updates"
              append-icon="update"
              light
            />
            <v-checkbox
              v-model="settings.ding"
              :disabled="!settings.websocket"
              label="Play sound when a new user register"
              append-icon="music_note"
              light
            />
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer/>
      <v-btn
        color="red"
        flat
        @click.native="closeSettings">Cancel</v-btn>
      <v-btn
        :loading="loading"
        color="green"
        flat
        @click.native="saveSettings">Save</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  data () {
    return {
      loading: false,
      settings: {
        websocket: false,
        ding: false
      }
    };
  },
  computed: {
    ...mapGetters({
      storedSettings: 'user/getSettings'
    })
  },
  created () {
    if (this.storedSettings) {
      this.settings = { ...this.storedSettings };
    }
  },
  methods: {
    ...mapActions({
      setSettingsDialogOpen: 'layout/setSettingsDialogOpen',
      updateUserProfile: 'user/updateUserProfile',
      closeSocket: 'people/closeSocket',
      openSocket: 'people/openSocket'
    }),
    closeSettings () {
      this.setSettingsDialogOpen(false);
    },
    async saveSettings () {
      this.loading = true;
      const updateSocketConnection = this.settings.websocket !== this.storedSettings.websocket;
      await this.updateUserProfile({ settings: this.settings });
      if (updateSocketConnection) {
        this.settings.websocket ? this.openSocket() : this.closeSocket();
      }
      this.loading = false;
      this.setSettingsDialogOpen(false);
    }
  }
};
</script>

<style>

</style>
