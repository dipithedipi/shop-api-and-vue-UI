<template>
    <div v-if="alreadyLogged()">
        
    </div>
    <div v-else>
        <h3>Please log in for view the cart</h3>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            cart: JSON.parse(localStorage.getItem('cart')) || [],
        };
    },
    mounted() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        console.log(this.cart);
    },
    methods: {
        alreadyLogged() {
            if(localStorage.getItem("ALREADY_LOGGED")) {
                return true
            }
            return false
        }
    },
};
</script>
  