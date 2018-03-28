<template>
  <v-card>
    <v-card-title>
      Your profile:
    </v-card-title>
    <v-card-text>
      <form>
        <v-text-field
          v-validate="'required|max:254'"
          v-model="name"
          :counter="254"
          :error-messages="errors.collect('name')"
          label="Name"
          data-vv-name="name"
          required
        />
        <v-text-field
          v-validate="'email'"
          v-model="email"
          :error-messages="errors.collect('email')"
          label="E-mail"
          data-vv-name="email"
        />

      </form>
    </v-card-text>
    <v-card-actions>
      <v-btn
        color="primary"
        flat
        @click.stop="cancel">
        Close
      </v-btn>
      <v-spacer />
      <v-btn
        color="primary"
        @click.stop="save">
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
export default {
  name: 'UserProfileForm',
  data() {
    return {
      name: '',
      email: ''
    };
  },
  computed: {
    ...mapGetters({
      userProfile: 'user/getUserProfile'
    })
  },
  watch: {
    userProfile: {
      immediate: true,
      handler(p) {
        this.name = p.name;
        this.email = p.email;
      }
    }
  },
  methods: {
    ...mapActions({
      saveUserProfile: 'user/saveUserProfile'
    }),
    async save() {
      const profile = {
        name: this.name,
        email: this.email
      };
      await this.saveUserProfile(profile);
      this.$router.push('/');
    },
    cancel() {
      this.$router.push('/');
    }
  }
};
</script>

<style>

</style>
