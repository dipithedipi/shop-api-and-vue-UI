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

                <div v-if="!randomInfo">
                <v-card-text>
                    Customer Name:
                    <v-text-field 
                    v-model="customerName">
                    </v-text-field>
                </v-card-text>

                <v-card-text>
                    Contact Last Name:
                    <v-text-field 
                    v-model="contactLastName">
                    </v-text-field>
                </v-card-text>

                <v-card-text>
                    Contact First Name:
                    <v-text-field 
                    v-model="contactFirstName">
                    </v-text-field>
                </v-card-text>

                <v-card-text>
                    Phone:
                    <v-text-field 
                    v-model="phone">
                    </v-text-field>
                </v-card-text>

                <v-card-text>
                    Address Line 1:
                    <v-text-field 
                    v-model="addressLine1">
                    </v-text-field>
                </v-card-text>

                <v-card-text>
                    Address Line 2:
                    <v-text-field 
                    v-model="addressLine2">
                    </v-text-field>
                </v-card-text>

                <v-card-text>
                    City:
                    <v-text-field 
                    v-model="city">
                    </v-text-field>
                </v-card-text>

                <v-card-text>
                    State:
                    <v-text-field 
                    v-model="state">
                    </v-text-field>
                </v-card-text>

                <v-card-text>
                    Postal Code:
                    <v-text-field 
                    v-model="postalCode">
                    </v-text-field>
                </v-card-text>

                <v-card-text>
                    Country:
                    <v-text-field 
                    v-model="country">
                    </v-text-field>
                </v-card-text>

                <v-card-text>
                    Sales Rep Employee Number:
                    <v-autocomplete
                    clearable
                    v-model="salesRepEmployeeNumber"
                    label="Autocomplete"
                    :items="employeesNumbers"
                  ></v-autocomplete>
                </v-card-text>

                <v-card-text>
                    Credit Limit:
                    <v-text-field 
                    v-model="creditLimit">
                    </v-text-field>
                </v-card-text>
                </div>

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
import { faker } from '@faker-js/faker';

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
      customerName: "",
      contactLastName: "",
      contactFirstName: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      salesRepEmployeeNumber: "",
      creditLimit: "",
      employees: [],
      employeesNumbers: []
    }
  },
  mounted() {
    this.getEmpoyeesNumbers()
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
    register(email, password) {
      if(this.randomInfo == true) {
        this.customerName = "Random Customer Name";
        this.contactLastName = faker.person.lastName()
        this.contactFirstName = faker.person.firstName()
        this.phone = faker.phone.number()
        this.addressLine1 = faker.location.streetAddress()
        this.addressLine2 = faker.location.streetAddress()
        this.city = faker.location.city()
        this.state = faker.location.countryCode('alpha-2')
        this.postalCode = faker.number.int({ min: 10000, max: 30000 })
        this.country = faker.location.country()
        this.salesRepEmployeeNumber = this.employees[faker.number.int({ min: 0, max: this.employees.length - 1 })].employeeNumber
        this.creditLimit = faker.number.int({ min: 0, max: 300000 })
      } else {
        if (this.customerName === "" || this.contactLastName === "" || this.contactFirstName === "" || this.phone === "" || this.addressLine1 === "" || this.addressLine2 === "" || this.city === "" || this.state === "" || this.postalCode === "" || this.country === "" || this.salesRepEmployeeNumber === "" || this.creditLimit === "") {
          alert("Client: Please enter all fields");
          return;
        }
        this.salesRepEmployeeNumber = this.salesRepEmployeeNumber.employeeNumber
      }

      fetch("http://127.0.0.1:3000/register/customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: this.customerName,
          contactLastName: this.contactLastName,
          contactFirstName: this.contactFirstName,
          phone: this.phone,
          addressLine1: this.addressLine1,
          addressLine2: this.addressLine2,
          city: this.city,
          state: this.state,
          postalCode: this.postalCode,
          country: this.country,
          salesRepEmployeeNumber: this.salesRepEmployeeNumber,
          creditLimit: this.creditLimit,
          email: email,
          password: password,
          passwordConfirm: password
        })
      })
      .then(response => response.json())
      .then(data => {
        if(data.message) {
          alert(data.message)
        }
      })
    },
    getEmpoyeesNumbers() {
      fetch("http://127.0.0.1:3000/employees", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      })
      .then(response => response.json())
      .then(data => {
        this.employees = data
        console.log(this.employees)
        this.employeesNumbers = data.map(employee => employee.employeeNumber + " - " + String(employee.firstName) + " " + String(employee.lastName))
      })
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
