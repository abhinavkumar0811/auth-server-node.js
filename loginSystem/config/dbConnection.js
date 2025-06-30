const mongoose = require('mongoose');
const dotenv = require('dotenv')

const dbConnection = () => {
    mongoose
        .connect(process.env.DB_CONNECTION_URL)
        .then(
            console.log("your db connected successfully")
        )
        .catch((error) => {
            console.log("your db not connected ")
        })

}

module.exports = dbConnection;