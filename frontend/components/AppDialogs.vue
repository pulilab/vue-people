<template>
  <div>
    <v-dialog
      v-model="optOutDialog"
      persistent
      max-width="300">
      <v-card>
        <v-card-title class="headline">Do you really want to leave us ?</v-card-title>
        <v-card-text>
          We will delete all your stored data and your pin on the map, you can join us back again anytime
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn
            color="green"
            flat
            @click.native="cancelOptOut">Cancel</v-btn>
          <v-btn
            color="red"
            flat
            @click.native="confirmOptOut">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="settingsDialog"
      persistent
      max-width="450"
    >
      <settings-form />
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import SettingsForm from './SettingsForm';

export default {
  components: {
    SettingsForm
  },
  computed: {
    ...mapGetters({
      optOutDialog: 'layout/getOptOutDialogOpen',
      settingsDialog: 'layout/getSettingsDialogOpen'
    })
  },
  methods: {
    ...mapActions({
      setOptOutDialogOpen: 'layout/setOptOutDialogOpen',
      setSettingsDialogOpen: 'layout/setSettingsDialogOpen',
      optOut: 'user/optOut'
    }),
    confirmOptOut () {
      this.setOptOutDialogOpen(false);
      this.optOut();
    },
    cancelOptOut () {
      this.setOptOutDialogOpen(false);
    },
    closeSettings () {
      this.setSettingsDialogOpen(false);
    },
    saveSettings () {
      this.setSettingsDialogOpen(false);
    }
  }
};
</script>

<style>

</style>
