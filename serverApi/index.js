import express from 'express';
import cors from 'cors';
import mysql from 'mysql';
import swaggerUI from 'swagger-ui-express';
import yaml from 'yamljs';
import 'dotenv/config';
import sanitizer from "perfect-express-sanitizer";
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import sha256 from 'crypto-js';



const swaggerDocument = yaml.load('./swagger.yaml');

const app = express();
app.use(cors());

const db = mysql.createConnection({
    host: "127.0.0.1",
    port: "3306",
    user: "root",
    password: "",
    // user: process.env.DB_USERNAME,
    // password: process.env.DB_PASSWORD,
    database: "store"
});

app.use('/swagger', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use(
    sanitizer.clean({
      xss: true,
      noSql: true,
      sql: true,
    })
  );

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

app.get('/employees', (req, res) => {
    db.query('SELECT employees.* FROM employees', (err, result) => {
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

//login for customers
app.post("/login/customer", (req, res) => {

    let email = req.body.email;
    let password = req.body.password;
    let hashedPassword = sha256(String(password + PASSWORD_SALT)).toString();    

    db.query('SELECT customers.* FROM customers WHERE email = ? AND password = ?', [email, hashedPassword], (err, result) => {
        if (err) {
            console.error('[!] Error: ' + err.stack);
            res.status(500).json({ message: "Database query error!" });
            return;
        }

        jwt.sign(
            { 
                id: result.customerNumber, 
                name: result.customerName 
            }, 
            process.env.JWT_SECRET, 
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }, (err, token) => {
            if (err) {
                console.error('[!] Error: ' + err.stack);
                res.status(500).json({ message: "Error creating token!" });
                return;
            }
            res.status(200).json({ token: token, user: result });
        });
    });
});

app.listen(3000, () => {
    console.log(`[+] Server started on port 3000`);
});