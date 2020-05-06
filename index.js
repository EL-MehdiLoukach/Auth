const express = require('express');
const mongoose = require('mongoose');
const keys = require('./config/key');
const db = keys.mongodb.dbURI;
const server = express();
const PORT = 3333;
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
server.use((req,res,next)=>{
    if(req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === "JWT"){
        jwt.verify(req.headers.authorization.split(' ')[1], "Authentication", (err,decode)=>{
            if(err) req.account = undefined;
            req.account = decode;
            next();
        })
    }
    else {
        req.account = undefined;
        next();
    }
})
server.use(helmet());

server.use(express.urlencoded({ extended: false }));
server.use(express.json());

// Routes 
const Account = require('./routes/account');
server.use('/account',Account);

// Database Connection
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));


server.listen(PORT, ()=>{
    console.log(`Magic is happening on port : ${PORT}`);
})