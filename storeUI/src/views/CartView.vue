<template>
    <div style="padding-right: 5%; padding-left: 5%;" v-if="alreadyLogged()">
        <div v-if="cart.length > 0">
            <v-card flat>
                <v-divider></v-divider>
                <v-data-table v-model:search="search" :items="cart" :headers="headers">
                    <template v-slot:[`item.img`]="{ item }">
                        <v-img :src="item.img" max-height="100" max-width="100"></v-img>
                    </template>
                    <template v-slot:[`item.productDescription`]="{ item }">
                        {{ truncateDescription(item.productDescription) }}
                    </template>
                    <template v-slot:[`item.quantity`]="{ item }">
                        <div class="d-flex align-center">
                            <v-btn @click="decrementQuantity(item)" color="error" size="x-small" icon="mdi-minus"></v-btn>
                            <div style="padding-left: 10px; padding-right: 10px;">
                                {{ item.quantity }}
                            </div>
                            <v-btn @click="incrementQuantity(item)" color="success" size="x-small" icon="mdi-plus"></v-btn>
                        </div>
                    </template>
                    <template v-slot:[`item.total`]="{ item }">
                        {{ calculateTotal(item) }}
                    </template>
                </v-data-table>
            </v-card>
            <h3>
                Total = {{ Math.floor(cart.reduce((acc, item) => acc + calculateTotal(item), 0) * 100) / 100 }} $
            </h3>
            <div style="display: flex; justify-content: center; padding-top: 10px;">
                <v-btn color="primary" append-icon="mdi-credit-card-outline" @click="checkout()">Checkout</v-btn>
                <div style="width: 10px;"></div>
                <v-btn color="primary" append-icon="mdi-nuke" @click="clearCart()">Clear Cart</v-btn>
            </div>
        </div>
        <div v-else>
            <h3>The cart is empty</h3>
        </div>
    </div>
    <div v-else>
        <h3>Please log in to view the cart</h3>
    </div>

    <div>
        <v-sheet class="position-relative" min-height="450">

            <v-fade-transition hide-on-leave>
                <v-card v-if="dialog" append-icon="$close" class="mx-auto" elevation="16" max-width="500"
                    title="Result checkout">
                    <template v-slot:append>
                        <v-btn icon="$close" variant="text" @click="dialog = false"></v-btn>
                    </template>

                    <v-divider></v-divider>

                    <div class="py-12 text-center">
                        <v-icon class="mb-6" :color="(this.checkoutResult == 'Checkout successful!') ? 'success' : 'error' " :icon="(this.checkoutResult == 'Checkout successful!') ? 'mdi-check-circle-outline' : 'mdi-alert-circle-outline' " size="128"></v-icon>

                        <div class="text-h4 font-weight-bold">{{ this.checkoutResult }}</div>
                    </div>

                    <v-divider></v-divider>

                    <div class="pa-4 text-end">
                        <v-btn class="text-none" color="medium-emphasis" min-width="92" rounded variant="outlined"
                            @click="dialog = false">
                            Close
                        </v-btn>
                    </div>
                </v-card>
            </v-fade-transition>
        </v-sheet>
    </div>
</template>

<script>
export default {
    data() {
        return {
            cart: JSON.parse(localStorage.getItem('cart')) || [],
            search: '',
            dialog: false,
            checkoutResult: "",
            headers: [
                { title: 'Image', key: 'img', align: 'center' },
                { title: 'Product Name', key: 'productName', align: 'center' },
                { title: 'Description', key: 'productDescription', align: 'center' },
                { title: 'Unit Price', key: 'MSRP', align: 'center' },
                { title: 'Quantity', key: 'quantity', align: 'center' },
                { title: 'Total', key: 'total', align: 'center' },
            ],
        };
    },
    mounted() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
    },
    methods: {
        alreadyLogged() {
            return localStorage.getItem("ALREADY_LOGGED") ? true : false;
        },
        incrementQuantity(item) {
            if (item.quantity < item.quantityInStock) {
                item.quantity++;
            } else {
                alert("The stock is not enough for this quantity");
            }
            localStorage.setItem('cart', JSON.stringify(this.cart));
        },
        decrementQuantity(item) {
            if (item.quantity > 1) {
                item.quantity--;
            } else {
                if (confirm("Are you sure you want to remove this item from the cart?")) {
                    this.removeItem(item);
                }
            }
            localStorage.setItem('cart', JSON.stringify(this.cart));
        },
        calculateTotal(item) {
            return Math.floor(item.MSRP * item.quantity * 100) / 100;
        },
        removeItem(item) {
            const index = this.cart.indexOf(item);
            if (index > -1) {
                this.cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(this.cart));
            }
        },
        truncateDescription(description) {
            return description.length > 128 ? description.substring(0, 128) + "..." : description;
        },
        clearCart() {
            if (confirm("Are you sure you want to clear the cart?")) {
                this.cart = [];
                localStorage.setItem('cart', JSON.stringify(this.cart));
            }
        },
        checkout() {
            fetch('http://localhost:3000/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cart: this.cart,
                    token: localStorage.getItem('JWT'),
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.message == "Checkout successful!") {
                        this.cart = [];
                        localStorage.setItem('cart', JSON.stringify(this.cart));
                        this.dialog = true;
                        this.checkoutResult = "Checkout successful!";
                    } else {
                        alert("Checkout failed");
                        this.checkoutResult = "Checkout failed";
                    }
                });
        }
    },
};
</script>
