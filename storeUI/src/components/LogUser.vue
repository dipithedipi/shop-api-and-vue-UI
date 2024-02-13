<template>
    <v-expansion-panels class="pa-4">
        <v-expansion-panel
            :key="i"
            hide-actions
        >
            <v-expansion-panel-title>
                <v-row
                    align="center"
                    class="spacer"
                    no-gutters
                >
                    <v-col
                        cols="4"
                        sm="2"
                        md="1"
                    >
                        <v-avatar
                            size="36px"
                        >
                            <v-img
                                alt="Avatar"
                                :src="user && user.image"
                            ></v-img>
                        </v-avatar>
                    </v-col>

                    <v-col
                        class="hidden-xs-only text-left ms-2"
                        sm="5"
                        md="3"
                    >
                        <strong v-html="user && user.username"></strong>
                    </v-col>                
                </v-row>
            </v-expansion-panel-title>

            <!-- <v-expansion-panel-text>
                <v-btn 
                prepend-icon="mdi-account"
                @click="() => this.$router.push({ path: '/profile' })"
                >Profile page</v-btn>
            </v-expansion-panel-text> -->
            <v-expansion-panel-text>
                <v-btn 
                prepend-icon="mdi-logout"
                @click="logout"
                >Logout</v-btn>
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>
</template>

<script>
export default {
    data: () => ({
        user: JSON.parse(localStorage.getItem('loggedUser'))
    }),
    mounted(){
        this.user = JSON.parse(localStorage.getItem('loggedUser'));
        console.log("loggedUser: ", this.user);
    },
    methods: {
        logout() {
            localStorage.removeItem('loggedUser');
            this.$router.push({ path: '/' });
        }
    }
}
</script>
