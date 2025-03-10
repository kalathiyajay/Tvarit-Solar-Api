const mongoose = require('mongoose');

const connectDb = async () => {
    try {
        await mongoose
            .connect(process.env.MONGODB_PATH)
            .then(() => console.log('DB Is Connected...'))
    } catch (error) {
        console.log(error);
        return res.json({ status: 500, message: error.message });
    }
}

module.exports = connectDb;