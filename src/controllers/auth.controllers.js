
require('dotenv').config();
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");




const generateToken = (user) => {
    return jwt.sign({ user },'masaisecret');
}

const register = async (req, res) => {
    try {
        const { email, password } = req.body 
        let user = await User.findOne({ email: req.body.email })
        
        // if user is already registered
        if (user) {
            return res.status(400).send({ message: 'email is already registered' });    
        }

        

        // if password is less than 8 characters
        if (req.body.password.length < 8) {
            return res.status(400).send({ message: 'Password must be at least 8 characters long' });    
        }            

        // if email is not registered
        user = await User.create(req.body);
        const token = generateToken(user);
        return res.status(200).send({user , token});    
        
    } catch (error) {
        return res.status(400).send({ Errors: error.message });
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

const forgot = async (req, res) => {
    try {        
        let user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.status(400).send("User Does Not Exist");
        }
        const token = jwt.sign({ user }, 'masaisecret', { expiresIn: "5m" });        
        
        // const link = `http://localhost:8085/reset/${user._id}/${token}`
        const link = `${user._id}/${token}`
             

        return res.status(200).send({ link, message: "link sended" });
    } catch (error) {
        return res.status(400).send({ Error: error.message });
    }
}

const reset = async (req, res) => {
    try {
        let user = await User.findOne({ _id: req.params.id })
        if (!user) {
            return res.status(400).send("User Does Not Exist");
        }
        const verify  = jwt.verify(req.params.token,'masaisecret')
        console.log(verify.user._id === req.params.id);        
            
        
        if (verify.user._id === req.params.id) {
            const encryptedpassword = await bcrypt.hashSync(req.body.password, 8);
            await User.updateOne(
                { _id: req.params.id },
                {
                    $set: { 
                        password:encryptedpassword,
                    }
                }
            );
            return res.status(200).send({ message: 'Password updated Successfully' });
        }
        return res.status(200).send({ message: 'Not verified password' });
        
    } catch (error) {
        return res.status(400).send({ Error: error.message });
    }
}

const updateData = async (req, res) => {
        console.log(req.params.id)
    console.log(req.params.token)
    try {
        let user = await User.findOne({ _id: req.params.id })
        if (!user) {
            return res.status(400).send("User Does Not Exist");
        }
        const verify = jwt.verify(req.params.token, 'masaisecret')   


        if (verify.user._id === req.params.id) {
            const userName = req.body.name;
            const mobileNum = req.body.mobile;
            const userPlace = req.body.place;
            let val;
            if (userName && mobileNum && userPlace) {
               val = await User.updateOne(
                    { _id: req.params.id },
                    {
                        $set: {
                            name: userName,
                            mobile: mobileNum,
                            place: userPlace
                        }
                    }
                ); 
            } else if (userName && mobileNum) {
                val =  await User.updateOne(
                    { _id: req.params.id },
                    {
                        $set: {
                            name: userName,
                            mobile: mobileNum,                            
                        }
                    }
                ); 
            } else if (userName && userPlace) {
                val =  await User.updateOne(
                    { _id: req.params.id },
                    {
                        $set: {
                            name: userName,                            
                            place: userPlace
                        }
                    }
                ); 

            } else if (mobileNum && userPlace) {
                val =  await User.updateOne(
                    { _id: req.params.id },
                    {
                        $set: {                            
                            mobile: mobileNum,
                            place: userPlace
                        }
                    }
                ); 
            }
            else if (userName) {
                val = await User.updateOne(
                    { _id: req.params.id },
                    {
                        $set: {
                            name: userName,
                        }
                    }
                );    
            } else if (mobileNum) {
                val = await User.updateOne(
                    { _id: req.params.id },
                    {
                        $set: {
                            mobile: mobileNum,
                        }
                    }
                );    
            } else if (userPlace) {
                val =   await User.updateOne(
                    { _id: req.params.id },
                    {
                        $set: {
                            place: userPlace,
                        }
                    }
                );    
            }                        
            return res.status(200).send({ val, message: 'Update Successful.' });
        }
        else
        return res.status(200).send({ message: 'Not verified password' });

    } catch (error) {
        return res.status(400).send({ Error: error.message });
    }
}

module.exports = { register, login, forgot, reset, updateData };

