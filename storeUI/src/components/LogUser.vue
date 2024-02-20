<template>
  <v-expansion-panels class="pa-4">
    <v-expansion-panel :key="i" hide-actions>
      <v-expansion-panel-title>
        <v-row align="center" class="spacer" no-gutters>
          <v-col cols="4" sm="2" md="1">
            <v-avatar size="36px">
              <v-img alt="Avatar" :src="user && user.img"></v-img>
            </v-avatar>
          </v-col>

          <v-col class="hidden-xs-only text-left ms-2" sm="5" md="3">
            <strong>{{ user.contactLastName }} {{ user.contactFirstName }}</strong>
          </v-col>
        </v-row>
      </v-expansion-panel-title>

      <!-- <v-expansion-panel-text>
                <v-btn 
                prepend-icon="mdi-account"
                @click="() => this.$router.push({ path: '/profile' })"
                >Profile page</v-btn>
            </v-expansion-panel-text> -->
      <v-expansion-panel-text>
        <v-btn prepend-icon="mdi-logout" rounded="sm" size="large" tonal color="red" @click="logout">Logout</v-btn>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  data: () => ({
    user: JSON.parse(localStorage.getItem('user'))
  }),
  mounted() {
    this.user = JSON.parse(localStorage.getItem('user'));
  },
  methods: {
    ...mapMutations(["setUser", "setToken"]),
    logout() {
      localStorage.removeItem("ALREADY_LOGGED")
      localStorage.removeItem("JWT")
      localStorage.removeItem("user")

      this.setUser(null);
      this.setToken(null);

      this.$router.push({ path: '/login' });
    }
  }
}
</script>
