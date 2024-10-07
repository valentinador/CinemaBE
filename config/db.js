const moongose = require('mongoose');

const connectDB = async ()=>{
    const connection = await moongose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected: ', connection.connection.host);
}

module.exports = connectDB