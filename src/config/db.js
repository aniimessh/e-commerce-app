const mongoose = require("mongoose")

const connectToDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to database");
    }catch(error){
        console.log("Error connecting to database");
        console.log(error.message);
    }
}

module.exports = connectToDB;