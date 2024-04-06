const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
require('dotenv').config();

const User = require('../models/User');


const authController = {
    // Register
    registerUser : async (req, res) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);

            // Create a new user
            const newUser = await new User({
                username: req.body.username,
                email: req.body.email,
                password: hashed,
            })
            
            // Save to DB
            const user = await newUser.save();
            res.status(200).json(user);
         
        } catch (error) {
            res.status(500).json({err});
        }
    },

    //Login
    loginUser: async(req, res) => {
        try {
            const user = await User.findOne({username: req.body.username});
            if ( !user ) {
                res.status(404).json("Wrong username!~");
            };
            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password
            );
            if ( !validPassword ) {
                res.status(404).json("Wrong password");
            };
            if (user && validPassword) {
                const accessToken = jwt.sign({
                    id: user.id,
                    admin: user.admin,
                },
                process.env.JWT_ACCESS_KEY,
                {expiresIn: "30s"},    // Thoi gian het han token
                );

                res.status(200).json({ user, accessToken });
            }
        } catch (error) {
            res.status(500).json(error);
        }
    }
};



module.exports = authController;