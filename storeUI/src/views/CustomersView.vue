<template>
  <v-card flat title="Customers">
    <v-btn @click="showColumnMenu = true">Filter Menu</v-btn>
    <v-menu v-model="showColumnMenu" offset-y :class="{ 'centered-menu': showColumnMenu }" class="flex justify-center items-center h-screen my-4 mx-2">
      <v-card>
        <v-container>
          <v-row>
            <v-col v-for="(column, index) in availableColumns" :key="index" cols="2">
              <v-checkbox v-model="selectedColumns" :label="column.title" :value="column.key"></v-checkbox>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" class="text-center">
              <v-btn @click="applyColumnSelection">Apply</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-menu>

    <template v-slot:[`text`]>
      <v-text-field
        v-model="search"
        label="Ricerca"
        prepend-inner-icon="mdi-magnify"
        single-line
        variant="outlined"
        hide-details
      ></v-text-field>
    </template>

    <v-data-table
      :headers="filteredHeaders"
      :items="filteredCustomers"
      density="compact"
      hover="true"
      class="mx-2"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon size="small" class="me-2" @click="console.log(item)">
          mdi-account-arrow-right
        </v-icon>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      customers: [],
      search: '',
      showColumnMenu: false,
      selectedColumns: [
        'customerNumber',
        'customerName',
        'phone',
        'addressLine1',
        'city',
        'postalCode',
        'country',
        'creditLimit',
        'email',
        'actions'
      ],
      availableColumns: [
        { title: 'Numero cliente', align: 'center', key: 'customerNumber' },
        { title: 'Nome cliente', align: 'center', key: 'customerName' },
        { title: 'Cognome contatto', align: 'center', key: 'contactLastName' },
        { title: 'Nome contatto', align: 'center', key: 'contactFirstName' },
        { title: 'Telefono', align: 'center', key: 'phone' },
        { title: 'Indirizzo 1', align: 'center', key: 'addressLine1' },
        { title: 'Indirizzo 2', align: 'center', key: 'addressLine2' },
        { title: 'Città', align: 'center', key: 'city' },
        { title: 'Stato', align: 'center', key: 'state' },
        { title: 'CAP', align: 'center', key: 'postalCode' },
        { title: 'Nazione', align: 'center', key: 'country' },
        { title: 'Numero Dipendente Venditore', align: 'center', key: 'salesRepEmployeeNumber' },
        { title: 'Limite di credito', align: 'center', key: 'creditLimit' },
        { title: 'Email', align: 'center', key: 'email' },
        { title: 'Password', align: 'center', key: 'pwd' },
        { title: 'Azioni', align: 'center', key: 'actions', sortable: false }
      ],
      headers: [
        { title: 'customerNumber', align: 'center', key: 'customerNumber' },
        { title: 'customerName', align: 'center', key: 'customerName' },
        { title: 'contactLastName', align: 'center', key: 'contactLastName' },
        { title: 'contactFirstName', align: 'center', key: 'contactFirstName' },
        { title: 'phone', align: 'center', key: 'phone' },
        { title: 'addressLine1', align: 'center', key: 'addressLine1' },
        { title: 'addressLine2', align: 'center', key: 'addressLine2' },
        { title: 'city', align: 'center', key: 'city' },
        { title: 'state', align: 'center', key: 'state' },
        { title: 'postalCode', align: 'center', key: 'postalCode' },
        { title: 'country', align: 'center', key: 'country' },
        { title: 'salesRepEmployeeNumber', align: 'center', key: 'salesRepEmployeeNumber' },
        { title: 'creditLimit', align: 'center', key: 'creditLimit' },
        { title: 'email', align: 'center', key: 'email' },
        { title: 'pwd', align: 'center', key: 'pwd' },
        { title: 'Azioni', align: 'center', key: 'actions', sortable: false }
      ]
    };
  },
  computed: {
    filteredHeaders() {
      return this.headers.filter((header) => this.selectedColumns.includes(header.key));
    },
    filteredCustomers() {
      const searchTerm = this.search.toLowerCase();
      return this.customers.filter((customer) => {
        // Filtra in base alle colonne selezionate e al termine di ricerca
        return this.selectedColumns.some((columnKey) => {
          const fieldValue = String(customer[columnKey]).toLowerCase();
          return fieldValue.includes(searchTerm);
        });
      });
    },
  },
  mounted() {
    this.getCustomers();
  },
  methods: {
    async getCustomers() {
      this.customers = await fetch('http://127.0.0.1:3000/customers').then(response => response.json());
      console.log(this.customers);
      // Inizializza selectedColumns con tutte le colonne selezionate inizialmente
    },
    applyColumnSelection() {
      this.showColumnMenu = false;
    },
  },
};
</script>
