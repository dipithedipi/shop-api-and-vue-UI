<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/customers">Customers</router-link> |
      <router-link to="/employees">Employees</router-link> |
      <router-link to="/products">Products</router-link> |
      <router-link to="/about">About</router-link>
    </nav>
    <div
      v-if="alreadyLogged === true"
      >
      <log-user 
        class="log-user"
      >
      </log-user>
    </div>
      <div v-else>
        <router-link v-if="$route.path !== '/'" to="/">
          Sign in / Sign up
        </router-link>
      </div>
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

.log-user {
  padding: 20px;
  max-width: 75%;
  margin: 0 auto; /* Add this line to center horizontally */
  display: flex; /* Add this line to enable flexbox */
  justify-content: center; /* Add this line to center horizontally */
}
</style>

<script>
import LogUser from '@/components/LogUser.vue';

export default {
  data() {
    return {
      alreadyLogged: false,
      loggedUser: null,
    };
  },
  watch:{
    $route (){
      this.alreadyLogged = false;
      if(JSON.parse(localStorage.getItem('loggedUser'))){
        this.alreadyLogged = true;
        this.loggedUser = JSON.parse(localStorage.getItem('loggedUser'))
      }
    }
  },
  methods: {
  },
  components: {
    LogUser,
  },
};
</script>
