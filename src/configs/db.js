const mongoose = require("mongoose");
require('dotenv').config();

module.exports = () => {
    return mongoose.connect(
        `mongodb+srv://masoom:qXhYlQVI1Hv9enQT@cluster0.psqx1fe.mongodb.net/?retryWrites=true&w=majority`
    );
};
