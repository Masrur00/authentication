
require('dotenv').config();
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    return jwt.sign({ user },process.env.SECRET_KEY);
}

const register = async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email })
        
        if (user) {
            return res.status(400).send("Email is already registered");    
        }

        // if email is not registered
        user = await User.create(req.body);
        const token = generateToken(user);
        return res.status(200).send({user , token});    
        
    } catch (error) {
        return res.status(400).send({ Error: error.message });
    }
}

const login = async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.status(400).send("Wrong email or password"); 
        }

        // if email exists , check password
        const match = user.checkPassword(req.body.password);

        // if it doesn't match.
        if (!match) {
            return res.status(400).send({ message: 'Wrong email or password '});    
        }

        // if it matches
        const token = generateToken(user);
        return res.status(200).send({ user, token }); 
        
    } catch (error) {
        return res.status(400).send({ Error: error.message });
    }
}

module.exports = { register, login };

