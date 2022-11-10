const express = require("express");
const connect = require('./src/configs/db');
require("dotenv").config();
const { register, login, forgot, reset, updateData } = require('./src/controllers/auth.controllers');
var cors = require('cors')
// const userController = require('./src/controllers')

const app = express();
app.use(express.json());


app.use(cors())
app.post('/register', register);
app.post('/login', login);
app.post('/forgot', forgot);
app.post('/reset/:id/:token', reset);
app.patch('/update/:id/:token',updateData)


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