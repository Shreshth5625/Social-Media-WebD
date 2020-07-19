const express = require('express');

const app = express();

app.get('/',(req,res) => res.send("API running ")) //to test if listen is running

const PORT = process.env.PORT || 5000 // if there is no env variable set then it will run on port 5000

app.listen(PORT,()=>console.log(`Server started on port ${PORT}`));
