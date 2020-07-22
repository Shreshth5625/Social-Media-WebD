const express = require('express');
const connectDB = require('./config/db');   //to connect with database

const app = express();

//Connect database.
connectDB();

app.get('/',(req,res) => res.send("API running ")) //to test if listen is running

//Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

const PORT = process.env.PORT || 5000 ;// if there is no env variable set then it will run on port 5000

app.listen(PORT,()=>console.log(`Server started on port ${PORT}`));
