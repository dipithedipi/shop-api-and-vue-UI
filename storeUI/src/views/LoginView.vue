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
        @click="() => {if(login(userEmail, userPassword)) {this.$router.push({ path: '/products' })}}"
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
  </div>
</template>


<script>
import users from "../../public/users.json";
import { faker } from '@faker-js/faker';

export default {
  name: 'HomeView',
  data() {
    return {
      visible: false,
      users: JSON.parse(localStorage.getItem("users")) || users,
      userEmail: "",
      userPassword: "",
      emailRules: [
        value => !!value || 'Required.',
        value => (value || '').length <= 20 || 'Max 20 characters',
        value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        },
      ],
      passwordRules: [
        value => !!value || 'Required.',
        value => (value || '').length <= 32 || 'Max 32 characters',
        value => (value || '').length >= 8 || 'Min 8 characters',
      ],
      randomInfo: true,
    }
  },
  methods: {
    login(email, password) {
      if (email === "" || password === "") {
        console.log("login: ", "Please enter email and password");
        return false;
      }
      for (let i = 0; i < this.users.length; i++) {
        if (this.users[i].email === email && this.users[i].password === password) {
          console.log("login: ", this.users[i]);
          this.saveLocalLoggedUser(i);
          return true;
        }
      }
      console.log("login: ", "User not found");
      return false;
    },
    register(email, password) {
      if (this.login(email, password)) {
        console.log("register: ", "User already exists");
        return false;
      }
      if (this.randomInfo) {
        this.users.push(
          new Object({
            id: this.users.length + 1,
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            maidenName: faker.person.middleName(),
            age: faker.number.int({ min: 16, max: 100 }),
            gender: faker.person.sexType(),
            email: email,
            image: faker.image.avatarLegacy(),
            phone: faker.phone.number(),
            username: faker.internet.userName(),
            password: password,
            birthDate: faker.date.birthdate(),
            bloodGroup: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"][Math.floor(Math.random() * 8)],
            height: faker.number.int({ min: 150, max: 200 }),
            weight: Math.floor(faker.number.float({ min: 30, max: 200 })*100)/100,
            eyeColor: ["Green", "Red", "Blue", "Yellow", "Orange", "Gray"][Math.floor(Math.random() * 6)],
            hair: {
              color: ["Green", "Red", "Blue", "Yellow", "Orange", "Gray"][Math.floor(Math.random() * 6)],
              type: ["Straight", "Curly", "Wavy", "Coily", "Silky"][Math.floor(Math.random() * 5)],
            },
            domain: faker.internet.domainName(),
            ip: faker.internet.ip(),
            address: {
              address: faker.location.streetAddress(),
              city: faker.location.city(),
              coordinates: {
                lat: faker.location.latitude(),
                lng: faker.location.longitude()
              },
              postalCode: faker.number.int({ min: 10000, max: 30000 }),
              state: faker.location.countryCode('alpha-2')
            },
            macAddress: faker.internet.mac(),
            university: String(faker.location.state() + " University"),
            bank: {
              cardExpire: faker.date.future(),
              cardNumber: faker.finance.creditCardNumber(),
              cardType: ["maestro", "visa"][Math.floor(Math.random() * 2)],
              currency: faker.finance.currency(),
              iban: faker.finance.iban()
            },
            company: {
              address: {
                address: faker.location.streetAddress(),
                city: faker.location.city(),
                coordinates: {
                  lat: faker.location.latitude(),
                  lng: faker.location.longitude()
                },
                postalCode: faker.number.int({ min: 10000, max: 30000 }),
                state: faker.location.countryCode('alpha-2')
              },
              department: faker.commerce.department(),
              name: faker.company.name(),
              title: faker.person.jobTitle(),
            },
            ein: String(faker.number.int({ min: 10, max: 30 }) + "-" + faker.number.int({ min: 10000, max: 30000 })),
            ssn: String(faker.number.int({ min: 100, max: 1000 }) + "-" + faker.number.int({ min: 10, max: 100 }) + "-" + faker.number.int({ min: 1000, max: 10000 })),
            userAgent: faker.internet.userAgent(),
            crypto: {
              coin: ["Bitcoin", "Etherum", "Monero", "Coily", "Tether"][Math.floor(Math.random() * 4)],
              wallet: faker.finance.bitcoinAddress(),
              network: "Ethereum (ERC20)"
            }
          }
          )
        );
      } else {
        this.users.push(
          new Object({
            id: this.users.length + 1,
            email: email,
            password: password
          })
        );
      }
      console.log("register: ", this.users[this.users.length - 1]);
      this.saveLocalLoggedUser(this.users.length - 1);
      return true;
    },
    saveLocalLoggedUser(id) {
      localStorage.setItem('loggedUser', JSON.stringify(this.users[id]));
      localStorage.setItem('users', JSON.stringify(this.users));
    },
    alreadyLogged() {
      if (JSON.parse(localStorage.getItem('loggedUser'))) {
        return true;
      }
      return false;
    },
  },
  mounted() {
  }
}
</script>
