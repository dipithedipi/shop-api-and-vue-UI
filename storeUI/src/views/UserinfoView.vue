<template>
  <div class="bg-white overflow-hidden shadow rounded-lg border p-6">
    <div class="flex flex-col items-center">
      <!-- Profile Image -->
      <img :src="userInfo.image" alt="Profile Image" class="w-32 h-32 rounded-full mb-4">

      <!-- User Information -->
      <div class="text-lg font-medium text-gray-900 mb-2">
        {{ userInfo.name }}
      </div>
      <p class="text-sm text-gray-500 mb-4">
        This is some information about the user.
      </p>

      <!-- User Details -->
      <dl class="sm:divide-y sm:divide-gray-200">
        <div v-for="(value, key) in userInfo" :key="key" class="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">
            <strong> {{ formatLabel(key) }} </strong>
          </dt>
          <template v-if="isObject(value)">
            <dd v-if="key === 'address'" class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <div class="mb-2">{{ formatLabel(key) }}:</div>
              <div class="mb-1">{{ formatLabel('street') }}: {{ value.address }}</div>
              <div class="mb-1">{{ formatLabel('city') }}: {{ value.city }}</div>
              <div class="mb-1">{{ formatLabel('postalCode') }}: {{ value.postalCode }}</div>
              <div class="mb-1">{{ formatLabel('state') }}: {{ value.state }}</div>
              <div class="mb-1">
                <strong>{{ formatLabel('coordinates') }}:</strong>
                <div>Latitude: {{ value.coordinates.lat }}</div>
                <div>Longitude: {{ value.coordinates.lng }}</div>
                <!-- Map Component -->
                <div>
                  <MapWithMarker :lat="value.coordinates.lat" :lng="value.coordinates.lng" />
                </div>
              </div>
            </dd>
            <dd v-else-if="key === 'company'" class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <div>{{ formatLabel(key) }}:</div>
              <div>{{ formatLabel('name') }}: {{ value.name }}</div>
              <div>{{ formatLabel('title') }}: {{ value.title }}</div>
              <div>{{ formatLabel('department') }}: {{ value.department }}</div>
              <br>
              <div class="mb-1">
                <strong>{{ formatLabel('address') }}:</strong>
                <div>{{ formatLabel('street') }}: {{ value.address.address }}</div>
                <div>{{ formatLabel('city') }}: {{ value.address.city }}</div>
                <div>{{ formatLabel('postalCode') }}: {{ value.address.postalCode }}</div>
                <div>{{ formatLabel('state') }}: {{ value.address.state }}</div>
                <br>
                <div>
                  <strong>{{ formatLabel('coordinates') }}:</strong>
                  <div>Latitude: {{ value.address.coordinates.lat }}</div>
                  <div>Longitude: {{ value.address.coordinates.lng }}</div>
                  <!-- Map Component -->
                  <div>
                    <MapWithMarker :lat="value.address.coordinates.lat" :lng="value.address.coordinates.lng" />
                  </div>
                </div>
              </div>
            </dd>
            <dd v-else class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <div v-for="(subValue, subKey) in value" :key="subKey" class="mb-1">
                <strong> {{ formatLabel(subKey) }}: </strong>
                 {{ subValue }}
              </div>
            </dd>
          </template>
          <template v-else-if="key === 'image'">
            <!-- Skip the image as it is already displayed above -->
          </template>
          <template v-else>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ value }}
            </dd>
          </template>
        </div>
      </dl>
    </div>
  </div>
</template>

<style scoped>
/* Add any additional styling here */
/* Example: Add a border-bottom for visual separation */
.sm\:grid > div.with-line {
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 8px; /* Adjust as needed */
  margin-bottom: 8px; /* Adjust as needed */
}
</style>

<!--
    <template>
    <v-card class="mx-auto" max-width="434" rounded="0">
        <v-avatar color="grey" size="150" rounded="0">
            <v-img cover :src="userInfo.image"></v-img>
        </v-avatar>
        <div>
            <v-list>
                <template v-for="(value, key) in userInfo">
                    <template v-if="typeof value === 'object'">
                        <v-list-item :key="key" :title="key">
                            <v-list-item-content>
                                <v-list-item-title>{{ value }}</v-list-item-title>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-list-item-group>
                                    <v-list-item v-for="(nestedValue, nestedKey) in value" :key="nestedKey"
                                        :title="nestedKey" :subtitle="nestedValue"></v-list-item>
                                </v-list-item-group>
                            </v-list-item-action>
                        </v-list-item>
                    </template>
                    <template v-else>
                        <v-list-item :key="key" :title="key" :subtitle="value"></v-list-item>
                    </template>
                </template>
            </v-list>
        </div>
    </v-card>
</template>
-->

<script>
import MapWithMarker from "@/components/MapWithMarker.vue";
import users from "../../public/users.json";

export default {
  components: {
    MapWithMarker
  },
  data() {
    return {
      users: [],
      userInfo: {}
    };
  },
  methods: {
    getUsersData() {
      this.users = users;
    },
    findUser() {
      this.userInfo = this.users.find((user) => {
        return user.id === parseInt(this.$route.params.id);
      });
    },
    isObject(value) {
      return typeof value === "object" && value !== null && !Array.isArray(value);
    },
    formatLabel(key) {
      return key.replace(/([a-z0-9])([A-Z])/g, "$1 $2").charAt(0).toUpperCase() + key.slice(1);
    }
  },
  mounted() {
    this.getUsersData();
    this.findUser();
  }
};
</script>