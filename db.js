const mongoose = require('mongoose');
const mongoUrl= "mongodb://127.0.0.1:27017/";
const connectToMongo = () => {
    try {
        mongoose.set('strictQuery', false)
        mongoose.connect(mongoUrl) 
        console.log('db connected')
    } catch(error) {
        console.log(error)
        process.exit()
    }
}
module.exports = connectToMongo;