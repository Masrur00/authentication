const express = require("express");
const connect = require('./src/configs/db');
require("dotenv").config();
const { register, login } = require('./src/controllers/auth.controllers');
// const userController = require('./src/controllers')

const app = express();
app.use(express.json());

app.post('/register', register);
app.post('/login', login);

const PORT = process.env.PORT || 8085;
app.listen(PORT, async () => {
    try {
        await connect();
        console.log(`listening on port ${PORT}`)
    }
    catch (err) {
        console.log(err.message);
    }
});