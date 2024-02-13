<template>
    <v-carousel show-arrows="hover" hide-delimiters>
        <v-carousel-item v-for="(image, index) in images" 
        class="dialog-image"
        :key="index" 
        :src="image" 
        cover>
        </v-carousel-item>
    </v-carousel>
</template>
  
<style scoped>
.dialog-image {
  max-width: 100%; /* Set the maximum width to 100% */
  height: auto;    /* Maintain aspect ratio */
}
</style>

<script>
export default {
    props: {
        images: {
            type: Array,
            required: true,
        },
    },
    mounted(){
    console.log(this.images)
    }
};

</script>
  