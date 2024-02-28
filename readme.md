## SIMPLE STORE WITH DATABASE

### DATABASE: mysql
Load Data:
```
1) open the webui and create new database and name it 'store'
2) go to import, choose  serverApi/store.sql and press import
```

### BACKEND: node server
Install dependencies:
```
cd serverApi/
npm i
```

Start server command:
```
node index.js
```

### FRONTEND: vue framework with vuetify components
Install dependencies:
```
cd serverUI/
npm i
```

Start server command:
```
npm run serve
```