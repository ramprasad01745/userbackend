const express = require("express");
const mysql = require("mysql");
const bodyparser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const port = 5000;

dotenv.config();

const app = express();

app.use(bodyparser.json());

app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "user"
});

db.connect();

app.post("/adduser", (req, res) => {
    const { username, email } = req.body;

    const sql = "INSERT INTO user(name,email) VALUES(?,?)";

    db.query(sql, [username, email], (err, result) => {
        if (err) {
            res.status(500).send("error");
        } else {
            res.status(200).send("success");
        }
    });
});

app.post("/checkuser", (req, res) => {
    const { username, password } = req.body;


    
    const sql = "SELECT * FROM user WHERE name = ? AND password = ?";

    db.query(sql, [username,password], (err, result) => {
        if (err) {
            res.status(500).send("error");
        } else if (result.length === 0) {
            res.status(401).send("Authentication failed. User not found.");
        } else {
            const user = result[0];


                    // Create a JWT token with the secret key
                    const secretKey = process.env.JWT_SECRET || 'fallback_secret_key';
                    const token = jsonwebtoken.sign({ userId: user.id, username: user.name }, secretKey, { expiresIn: '1h' });

                    res.status(200).json({ token });
        
        }
    });
});

app.listen(port, () => {
    console.log("Server is running on port", port);
});
