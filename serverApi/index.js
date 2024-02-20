import express from 'express';
import cors from 'cors';
import mysql from 'mysql';
import swaggerUI from 'swagger-ui-express';
import yaml from 'yamljs';
import 'dotenv/config';
import sanitizer from "perfect-express-sanitizer";
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';



const swaggerDocument = yaml.load('./swagger.yaml');

const app = express();
app.use(cors());
app.use(bodyParser.json());

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

//auth for customers
app.post("/login/customer", (req, res) => {

    let email = req.body.email;
    let password = req.body.password;
    let hashedPassword = CryptoJS.SHA256(String(password + process.env.PASSWORD_SALT)).toString();    

    console.log("new login request: ");
    console.log("email: ", email);
    console.log("password: ", password);
    console.log("hashedPassword: ",hashedPassword);


    db.query('SELECT * FROM customers WHERE email = ? AND pwd = ?', [email, hashedPassword], (err, result) => {
        if (err) {
            console.error('[!] Error: ' + err.stack);
            res.status(500).json({ message: "Database query error!" });
            return;
        }
        
        if (result.length === 0) {
            res.status(400).json({ message: "Invalid email or password!" });
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
            //console.log(result);
            res.status(200).json({ token: token, user: result[0] });
        });
    });
});

app.post("/register/customer", (req, res) => {
    let customerName = req.body.customerName;
    let contactLastName = req.body.contactLastName;
    let contactFirstName = req.body.contactFirstName;
    let phone = Number(req.body.phone);
    let addressLine1 = req.body.addressLine1;
    let addressLine2 = req.body.addressLine2;
    let city = req.body.city;
    let state = req.body.state;
    let postalCode = Number(req.body.postalCode);
    let country = req.body.country;
    let salesRepEmployeeNumber = Number(req.body.salesRepEmployeeNumber);
    let creditLimit = Number(req.body.creditLimit);


    let email = req.body.email;
    let password = req.body.password;
    let passwordConfirm = req.body.passwordConfirm;

    if (!email || !password) {
        res.status(400).json({ message: "Email and password are required!" });
        return;
    }

    if (password.length < 6) {
        res.status(400).json({ message: "Password must be at least 6 characters long!" });
        return;
    }

    if (password !== passwordConfirm) {
        res.status(400).json({ message: "Passwords do not match!" });
        return;
    }

    if (!customerName || !contactLastName || !contactFirstName || !phone || !addressLine1 || !city || !state || !postalCode || !country || !salesRepEmployeeNumber || !creditLimit) {
        res.status(400).json({ message: "All fields are required!" });
        return;
    }

    if (isNaN(phone) || isNaN(postalCode) || isNaN(salesRepEmployeeNumber) || isNaN(creditLimit)) {
        res.status(400).json({ message: "Invalid input!" });
        return;
    }

    db.query('SELECT * FROM customers WHERE email = ?', [email], (err, result) => {
        if (err) {
            console.error('[!] Error: ' + err.stack);
            res.status(500).json({ message: "Database query error!" });
            return;
        }

        if (result.length > 0) {
            res.status(400).json({ message: "Email already exists!" });
            return;
        }

        let hashedPassword = CryptoJS.SHA256(String(password + process.env.PASSWORD_SALT)).toString();


        let customerNumber = Math.floor(Math.random() * 1000000);

        db.query('INSERT INTO customers (customerNumber, customerName, contactLastName, contactFirstName, phone, addressLine1, addressLine2, city, state, postalCode, country, creditLimit, email, salesRepEmployeeNumber, pwd) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [customerNumber, customerName, contactLastName, contactFirstName, phone, addressLine1, addressLine2, city, state, postalCode, country, creditLimit, email, salesRepEmployeeNumber, hashedPassword], (err, result) => {
            if (err) {
                console.error('[!] Error: ' + err.stack);
                res.status(500).json({ message: "Database query error!" });
                return;
            }
            res.status(200).json({ message: "Customer registered successfully!" });
        });
    });
});

app.listen(3000, () => {
    console.log(`[+] Server started on port 3000`);
});