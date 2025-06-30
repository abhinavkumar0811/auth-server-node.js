const JWT = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const SECRET_KEY = "15923ca65e11084d365e196282a5c1000a965b4dc25bee89afd068428cd3c8e8c3cf2bd415633f9e3e9a93fd342493b62b67c84075352b18ce3581274413f423";

const authentication = async (req, res, next) => {
    try {
        const userHeader = req.headers.authorization; // retrieve the authorization from req header.

        if (!userHeader || !userHeader.startsWith('Bearer ')) { // error handling
            return res.status(401).send({
                status: false,
                message: 'Authentication failed: Invalid or missing token',
            });
        }

        const token = userHeader.split(' ')[1]; // Extract the token from req header

        try {
            const decoded = JWT.verify(token, SECRET_KEY); // verify token with secret key
            console.log('jwt decoded payload', decoded); // print the decode payload in terminal
            req.user = decoded; // call the decode function for user verification
            next(); // call the next function
        } catch (error) {
            console.error('Error verifying token:', error); //Improved error message

            res.status(403).send({
                status: false,
                message: 'Authentication failed: Invalid token', // corrected error message
            });
        }
    } catch (error) {
        console.error('Error in authentication middleware:', error); //Improved error message
        res.status(500).send({
            status: false,
            message: 'Internal server error',
        });
    }
};

module.exports = authentication;