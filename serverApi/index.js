//products , customers, emplojers
import express from 'express';
import cors from 'cors';
import mysql from 'mysql';
import swaggerUI from 'swagger-ui-express';
import yaml from 'yamljs';
import 'dotenv/config';

const swaggerDocument = yaml.load('./swagger.yaml');

const app = express();
app.use(cors());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: "root",
    password: "",
    // user: process.env.DB_USERNAME,
    // password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

app.use('/swagger', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

db.connect((err) => {
    if (err) {
        console.error('[!] Error connecting to database: ' + err.stack);
        return;
    }
    console.log('[+] Connected to MySQL');
})

app.get('/products', (req, res) => {
    db.query('SELECT products.* FROM products', (err, result) => {
        if (err) {
            console.error('[!] Error: ' + err.stack);
            res.status(500).json({ message: "Database query error!" });
            return;
        }
        res.status(200).json(result);
    });
});

app.get('/products/:category', (req, res) => {
    let category = req.params.category;
    db.query(`SELECT products.* FROM products WHERE productLine='${category}'`, (err, result) => {
        if (err) {
            console.error('[!] Error: ' + err.stack);
            res.status(500).json({ message: "Database query error!" });
            return;
        }
        res.status(200).json(result);
    });
});

app.get('/customers', (req, res) => {
    db.query('SELECT customers.* FROM customers', (err, result) => {
        if (err) {
            console.error('[!] Error: ' + err.stack);
            res.status(500).json({ message: "Database query error!" });
            return;
        }
        res.status(200).json(result);
    });
});

app.get('/employees/:email/:password', (req, res) => {
    db.query('SELECT employees.* FROM employees WHERE email = ? AND password = ?', [req.params.email, req.params.password], (err, result) => {
        if (err) {
            console.error('[!] Error: ' + err.stack);
            res.status(500).json({ message: "Database query error!" });
            return;
        }
        res.status(200).json(result);
    });
});

app.listen(process.env.EXPRESS_PORT, () => {
    console.log(`[+] Server started on port ${process.env.EXPRESS_PORT}`);
});