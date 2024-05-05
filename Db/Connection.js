const mongoose  =  require('mongoose')

const connectDB = (uri)=>{
    console.log("Connected to Db")
    return mongoose.connect(uri)
}

module.exports = connectDB