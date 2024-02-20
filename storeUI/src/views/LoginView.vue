<template>
  <div v-if="!alreadyLogged()">
    <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
      <h2>
        Sign In
      </h2>
      
      <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
        Email address
      </div>
      <v-text-field density="compact" placeholder="Email address" prepend-inner-icon="mdi-email-outline"
        variant="outlined" v-model="userEmail"></v-text-field>

      <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
        Password

        <a class="text-caption text-decoration-none text-blue" href="#" rel="noopener noreferrer" target="_blank">
          Forgot login password?</a>
      </div>

      <v-text-field :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
        density="compact" placeholder="Enter your password" prepend-inner-icon="mdi-lock-outline" variant="outlined"
        @click:append-inner="visible = !visible" v-model="userPassword"></v-text-field>

      <v-btn 
        block 
        class="mb-8" 
        color="blue" 
        size="large" 
        variant="tonal" 
        @click="login(userEmail, userPassword)"
      >
        Log In
      </v-btn>

      <v-card-text class="text-center">
        <v-dialog width="500">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props">Sign up now<v-icon icon="mdi-chevron-right"></v-icon></v-btn>
          </template>

          <template v-slot:default="{ isActive }">
            <v-card title="Register">
              
              <v-card-text>
                    Email:
                    <v-text-field 
                    :rules="emailRules" 
                    v-model="userEmail">
                    </v-text-field>
                </v-card-text>

                <v-card-text>
                    Password:
                    <v-text-field 
                    :rules="passwordRules" 
                    v-model="userPassword">
                    </v-text-field>
                </v-card-text>

                <v-card-text>
                    <v-checkbox 
                    v-model="randomInfo"
                    label="Random info"
                    ></v-checkbox>
                </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                  text="Continue"
                  @click="() => {isActive.value = false; if(register(userEmail, userPassword)) {this.$router.push({ path: '/products' })}}"
                ></v-btn>
              </v-card-actions>
            </v-card>
          </template>
      </v-dialog>
      </v-card-text>
    </v-card>
  </div>
  <div v-else>
    You are already logged in, if you want to log in with another account, please log out first.
    <br>
    <br>
    <v-btn
      prepend-icon="mdi-logout"
      rounded="sm" 
      size="large"
      tonal
      color="red"
      @click="logout()"
      >
      Logout
    </v-btn>
  </div>
</template>


<script>
import { mapMutations } from 'vuex';

export default {
  name: 'HomeView',
  data() {
    return {
      visible: false,
      user: null,
      userEmail: "",
      userPassword: "",
      emailRules: [
        value => !!value || 'Required.',
        value => (value || '').length <= 32 || 'Max 32 characters',
        value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        },
      ],
      passwordRules: [
        value => !!value || 'Required.',
        value => (value || '').length <= 32 || 'Max 32 characters',
        value => (value || '').length >= 6 || 'Min 6 characters',
      ],
      randomInfo: true,
    }
  },
  methods: {
    ...mapMutations(["setUser", "setToken"]),
    login(email, password) {
      if (email === "" || password === "") {
        alert("Please enter email and password");
        return;
      }
      fetch("http://127.0.0.1:3000/login/customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      })
      .then(response => response.json())
      .then(data => {
        if(data.token) {
          console.log("success")
          localStorage.setItem("ALREADY_LOGGED", true)
          localStorage.setItem("JWT", data.token)
          localStorage.setItem("user", JSON.stringify(data.user))

          this.setUser(data.user);
          this.setToken(data.token);

          this.$router.push({ path: '/about' })
        }
        else {
          alert("Invalid email or password");
          return;
        }
      })
    },
    register() {
      // TODO
    },
    alreadyLogged() {
      if(localStorage.getItem("ALREADY_LOGGED")) {
        return true
      }
      return false
    },
    logout() {
      localStorage.removeItem("ALREADY_LOGGED")
      localStorage.removeItem("JWT")
      localStorage.removeItem("user")

      this.setUser(null);
      this.setToken(null);

      this.$router.go()
    }
  },
}
</script>
