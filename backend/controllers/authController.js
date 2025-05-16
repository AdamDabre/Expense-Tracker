const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

module.exports = {
    registerUser: async (req, res) => {
        const { fullName, email, password, profileImageURL } = req.body;

        // Validation: Check if any fields are missing

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        try {
            // Check if email already exists
            const existingUser = User.findOne({ email });

            // If user exists, return error
            if (existingUser) {
                return res
                    .status(400)
                    .json({ message: "Email already in use" });
            }

            // Create user
            const user = await User.create({
                fullName,
                email,
                password,
                profileImageURL,
            });

            res.status(201).json({
                id: user._id,
                user,
                token: generateToken(user._id), // Generate Token
            });
        } catch (error) {
            console.log("Error registering user", error);
            res.status(500).json({ error: error.message });
        }
    },
    loginUser: async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: "All fields are required" });
        }

        try {
            const user = await User.findOne({ email });
            if (!user || !(await user.comparePassword(password))) {
                res.status(400).json({ message: "Invalid Credentials" });
            }

            res.status(200).json({
                id: user._id,
                user,
                token: generateToken(user._id),
            });
        } catch (error) {
            console.log("Error logging in user", error);
            res.status(500).json({ error: error.message });
        }
    },
    getUserInfo: async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select("-password");

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json(user);
        } catch (error) {
            console.log("Error getting user information : ", error);
            res.status(500).json({ error: error.message });
        }
    },
};
