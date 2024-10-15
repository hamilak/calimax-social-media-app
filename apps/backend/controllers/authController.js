const userModel = require('../models/user')
const jwt = require('jsonwebtoken');
const userController = require('../controllers/userController')
const bcrypt = require('bcrypt')
// const dotenv = require('dotenv');

// dotenv.config()

const generateAccessToken = (user) => {
    return jwt.sign(
        { _id: user._id, username: user.username, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY }
    );
}

const generateRefreshToken = (user) => {
    return jwt.sign(
        { _id: user._id, username: user.username, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.REFRESH_EXPIRY }
    );
}

// login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body);

        const user = await userController.getUserByEmail(email);

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).send({ message: 'Wrong password' });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken;
        await user.save();

        res.status(201).send({ accessToken, refreshToken });
    } catch (error) {
        console.error(error);
        res.status(400).send({
            message: 'An error occurred while logging in',
            error: error.message,
        });
    }
};

// refresh token
exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    console.log(req.body)

    if (!refreshToken) {
        return res.status(403).send({ message: 'Refresh Token not provided' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await userModel.findOne({ _id: decoded._id, refreshToken });

        if (!user) {
            return res.status(403).send({ message: 'Invalid refresh token' });
        }

        const accessToken = generateAccessToken(user);

        res.status(200).send({ accessToken });
    } catch (error) {
        res.status(403).send({ message: 'Invalid or expired refresh token', error: error.message });
    }
}

exports.logout = async (req, res) => {

}