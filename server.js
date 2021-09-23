const app = require('./app');
const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

//connect to the database
mongoose.connect(`mongodb+srv://lystun:${process.env.DB_PASSWORD}@cluster0.k68im.mongodb.net/abfits?retryWrites=true&w=majority`, (err)=>{
    if(err){
        console.log(err);
    }else{
        console.log("DB Connection Successful!");
    }
});

//create a server
const PORT = 8000;
app.listen(PORT, () => {
    console.log(`ABFits listening on port ${PORT}.`);
});