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
        'employeeNumber',
        'LastName',
        'FirstName',
        'extension',
        'email',
        'officeCode',
        'reportsTo',
        'jobTitle',
        'actions'
      ],
      availableColumns: [
        { title: 'Numero impiegato', align: 'center', key: 'employeeNumber' },
        { title: 'Cognome', align: 'center', key: 'LastName' },
        { title: 'Nome', align: 'center', key: 'FirstName' },
        { title: 'Extension', align: 'center', key: 'extension' },
        { title: 'Email', align: 'center', key: 'email' },
        { title: 'Pwd', align: 'center', key: 'pwd' },
        { title: 'Codice ufficio', align: 'center', key: 'officeCode'},
        { title: 'Codice Resposabile', align: 'center', key: 'reportsTo'},
        { title: 'Lavoro', align: 'center', key: 'jobTitle'},
        { title: 'Azioni', align: 'center', key: 'actions'}
      ],
      headers: [
        { title: 'Numero impiegato', align: 'center', key: 'employeeNumber' },
        { title: 'Cognome', align: 'center', key: 'lastName' },
        { title: 'Nome', align: 'center', key: 'firstName' },
        { title: 'Extension', align: 'center', key: 'extension' },
        { title: 'Email', align: 'center', key: 'email' },
        { title: 'Pwd', align: 'center', key: 'pwd' },
        { title: 'Codice ufficio', align: 'center', key: 'officeCode'},
        { title: 'Codice Resposabile', align: 'center', key: 'reportsTo'},
        { title: 'Lavoro', align: 'center', key: 'jobTitle'},
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
      this.customers = await fetch('http://127.0.0.1:3000/employees').then(response => response.json());
      console.log(this.customers);
      // Inizializza selectedColumns con tutte le colonne selezionate inizialmente
    },
    applyColumnSelection() {
      this.showColumnMenu = false;
    },
  },
};
</script>
