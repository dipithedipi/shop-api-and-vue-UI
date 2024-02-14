<template>
  <div class="container">
    <v-data-iterator :items="products" :items-per-page="itemsPerPage">
      <template v-slot:header="{ page, pageCount, prevPage, nextPage }">
        <h1 class="text-h4 font-weight-bold d-flex justify-space-between mb-4 align-center">
          <div class="text-truncate">
            Products:{{ this.category }}
          </div>

          <div>
            <v-btn
              @click="getProductsData()"
              color="primary"
              size="small">
              <v-icon>mdi-filter</v-icon>
              Remove Filter
            </v-btn>
          </div>

          <div class="d-flex align-center">
            <v-btn class="me-1" variant="text" @click="onClickSeeAll">
              <span class="text-decoration-underline text-none">See all</span>
            </v-btn>

            <div class="d-inline-flex">
              <v-btn :disabled="page === 1" icon="mdi-arrow-left" size="small" variant="tonal" class="me-2"
                @click="prevPage"></v-btn>

              <v-btn :disabled="page === pageCount" icon="mdi-arrow-right" size="small" variant="tonal"
                @click="nextPage"></v-btn>
            </div>
          </div>
        </h1>
      </template>

      <template v-slot:default="{ items }">
        <v-row>
          <v-col v-for="(item, i) in items" :key="i" cols="12" sm="6" md="4" xl="3">
            <v-sheet border>
              <v-img :gradient="`to top right, rgba(255, 255, 255, .1), rgba(23, 43, 54, .15)`" :src="item.raw.img"
                cover height="150"></v-img>

              <v-list-item 
                :title="item.raw.productName" 
                lines="two" 
                density="comfortable" 
                style="min-height:100px"
                :subtitle="item.raw.productDescription">
                <template v-slot:title>
                  <strong class="text-h6">
                    {{ item.raw.title }}
                  </strong>
                </template>
              </v-list-item>

              <v-table density="compact" class="text-caption">
                <tbody>
                  
                  <tr align="right">
                    <th>Category:</th>
                    <td>
                      <v-chip color="gray" size="small" label @click="getProductsData(item.raw.productLine)">
                        <v-icon start icon="mdi-label"></v-icon>
                        {{ item.raw.productLine }}
                      </v-chip>
                    </td>
                  </tr>

                  <tr align="right">
                    <th>Stock:</th>
                    <td>
                      <v-chip :color="item.raw.quantityInStock ? 'green' : 'red'"
                        :text="item.raw.quantityInStock ? 'In stock (' + item.raw.quantityInStock + ')' : 'Out of stock'"
                        class="text-uppercase" label size="small"></v-chip>
                    </td>
                  </tr>

                  <tr align="right">
                    <th>Scale:</th>
                    <td>
                      {{ item.raw.productScale }}
                    </td>
                  </tr>

                  <tr align="right">
                    <th>Vendor:</th>
                    <td>
                      {{ item.raw.productVendor }}
                    </td>
                  </tr>
                  
                  <tr align="right">
                    <th>Price:</th>
                    <td>
                      <s>${{ item.raw.MSRP }}</s>
                      &nbsp;
                      <span class="text-h6">
                        ${{ item.raw.MSRP }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-sheet>
          </v-col>
        </v-row>
      </template>
    </v-data-iterator>
  </div>
</template>

<style scoped>
.stars-container {
  max-width: 100vw;
  overflow-x: hidden;
}

.container {
  margin-left: 10px;
  margin-right: 10px;
}
.selector-container {
  width: 80%;
}   

@media (min-width: 1000px) {
  .selector-container {
    width: 50%;
  }      
}
</style>

<script>
export default {
  data() {
    return {
      products: [],
      category: '',
      itemsPerPage: 8,
    };
  },
  mounted() {
    this.getProductsData();
  },
  methods: {
    onClickSeeAll() {
      this.itemsPerPage = this.itemsPerPage === 10 ? this.products.length : 10
    },
    async getProductsData(category) {
      if (category) {
        this.products = await fetch(`http://127.0.0.1:3000/products/${category}`).then(response => response.json());
        this.category = category;
        return;
      }
      this.products = await fetch('http://127.0.0.1:3000/products').then(response => response.json());
      this.category = '';
      console.log(this.products);
    },
  },
};
</script>
