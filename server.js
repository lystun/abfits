const app = require('./app');
const mongoose = require('mongoose');

//connect to the database
mongoose.connect("mongodb+srv://lystun:lystun1234@cluster0.k68im.mongodb.net/abfits?retryWrites=true&w=majority", ()=>{
    console.log("DB Connection Successful!");
});

//create a server
const PORT = 8000;
app.listen(PORT, () => {
    console.log(`ABFits listening on port ${PORT}.`);
});