const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const User = require('../models/User');
// const JWT_ACCESS_KEY = 'my_secret_jwt_key_123';

let refreshTokens = [];     // Luu tru cac refresh token cua nguoi dung (de kiem tra khi nguoi dung request refresh token)- Khi deploy se luu trong DB

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

    //GENERATE ACCESS TOKEN
    generateAccessToken: (user) => {
        return jwt.sign(
            {
                id : user.id,
                admin : user.admin,
            },
            process.env.JWT_ACCESS_KEY,
            {expiresIn: "30s"}, // 30s het han token
        )
    },

    // GENERATE REFRESH TOKEN
    generateRefreshToken: (user) => {
        return jwt.sign(
            {
                id: user.id,
                admin: user.admin,
            },
            process.env.JWT_REFRESH_KEY,
            {expiresIn: "365d"},
        );
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
                const accessToken = authController.generateAccessToken(user);
                const refreshToken = authController.generateRefreshToken(user);

                refreshTokens.push(refreshToken); // Luu tru refresh token cua nguoi dung

                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false, // true khi deploy
                    path: "/",
                    sameSite: "strict",
                })

                const { password, ...orthers } = user._doc;  // Lay het thong tin user tru password
                res.status(200).json({ ...orthers, accessToken } );
            }
        } catch (error) {
            res.status(500).json(error);
        }
    },

    
    requestRefeshToken: async (req, res) => {   // Request refresh token
        // Take refresh token from user
        const refreshToken = req.cookies.refreshToken;  // Lay refresh token tu cookie
        if (!refreshToken) {
           return res.status(403).json("User not authenticated!~");
        };

        if (!refreshTokens.includes(refreshToken)) {  // Kiem tra refresh token cua nguoi dung co ton tai trong mang refreshTokens khong    
            return res.status(403).json("Refresh token is not valid!~");
        };

        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {  // Kiem tra refresh token co hop le khong
            if (err) {
                console.log("err >> ", err);
            };
            refreshTokens = refreshTokens.filter((token) => token !== refreshToken); // Xoa refresh token cu trong mang
            // Create new access token and refresh token
            const newAccessToken = authController.generateAccessToken(user);
            const newRefreshToken = authController.generateRefreshToken(user);

            refreshTokens.push(newRefreshToken); // Luu tru refresh token moi cua nguoi dung

            res.cookie("refreshToken", newRefreshToken, {   // Set lai refresh token moi cho nguoi dung
                    httpOnly: true,
                    secure: false, // true khi deploy
                    path: "/",
                    sameSite: "strict",
            });
            res.status(200).json({ accessToken: newAccessToken });

        })
    },

    // LOGOUT
    logoutUser: async (req, res) => {
        // Xoa refresh token cua nguoi dung
        const refreshToken = req.cookies.refreshToken;
        refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
        res.clearCookie("refreshToken");
        res.status(200).json("Logout success!~");
    }
};

// STORE TOKEN
// 1 - LOCAL STORAGE - CO THE BI HACK(XSS : KHI NGUOI TA CHAY SCRIPT TREN TRANG WEB CUA BAN => CO THE LAY TOKEN CUA NGUOI DUNG)
// 2 - COOKIES - AN TOAN HON LOCAL STORAGE NHUNG VAN CO THE BI HACK(CSRF : KHI NGUOI TA TAO 1 TRANG WEB GIONG Y HET TRANG WEB CUA BAN => CO THE LAY TOKEN CUA NGUOI DUNG)
// CSRF -> CO THE DUOC KHAC PHUC BANG SAME SITE COOKIES
// HTTPONLY COOKIES - AN TOAN HON 
// 3 - REDUX STORE - AN TOAN HON LOCAL STORAGE VA COOKIES (LUU ACCESS TOKEN)
// HTTPONLY COOKIES - LUU REFRESH TOKEN

// BFF PARTENT - BACKEND FOR FRONTEND

module.exports = authController;