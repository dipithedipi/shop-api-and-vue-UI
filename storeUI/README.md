# starter

https://dummyjson.com/

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### link parametro
router-link :to="{ name: 'about', params: { teamId: item.raw.team.id } }" style="text-decoration: none;">

mounted() {const teamId = this.$route.params.teamId;}

