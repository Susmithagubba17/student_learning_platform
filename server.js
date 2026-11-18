const jwt = require("jsonwebtoken");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

dotenv.config();

const app = express();
app.use(express.json());

/* =============================
   MongoDB Connection
============================= */

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch(err => console.log(err));

/* =============================
   JWT Authentication Middleware
============================= */

const verifyToken = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();

    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

/* =============================
   Role Middleware
============================= */

const roleAuth = (roles) => {

    return (req, res, next) => {

        User.findById(req.userId)
            .then(user => {

                if (!user || !roles.includes(user.role)) {
                    return res.status(403).json({
                        message: "Access denied"
                    });
                }

                next();

            })
            .catch(err => {
                res.status(500).json({ message: err.message });
            });
    };
};

/* =============================
   Register API
============================= */

app.post("/register", async (req, res) => {

    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({
            message: "User registered successfully"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/* =============================
   Login API (Access + Refresh Token)
============================= */

app.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        // Access Token (Short Life)
        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        // Refresh Token (Long Life)
        const refreshToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: "7d" }
        );

        // Save refresh token in DB
        user.refreshToken = refreshToken;
        await user.save();

        res.json({
            message: "Login successful",
            accessToken,
            refreshToken,
            role: user.role
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/* =============================
   Refresh Token API
============================= */

app.post("/refresh-token", async (req, res) => {

    try {

        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({
                message: "Refresh token required"
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        const user = await User.findById(decoded.userId);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({
                message: "Invalid refresh token"
            });
        }

        const newAccessToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        res.json({ accessToken: newAccessToken });

    } catch (error) {
        res.status(403).json({
            message: "Invalid refresh token"
        });
    }
});

/* =============================
   Protected Routes
============================= */

app.get("/profile", verifyToken, async (req, res) => {

    try {
        const user = await User.findById(req.userId)
            .select("-password -refreshToken");

        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/* Admin Only Route */

app.get("/admin", verifyToken, roleAuth(["admin"]), (req, res) => {
    res.json({ message: "Welcome Admin 👑" });
});

/* User + Admin Route */

app.get("/profile-data",
    verifyToken,
    roleAuth(["user", "admin"]),
    (req, res) => {

        res.json({
            message: "Profile Data Access Granted"
        });

    });

/* =============================
   Start Server
============================= */

app.listen(5000, () => {
    console.log("Server running on port 5000");
});