const mongoose=require('mongoose');
const express=require('express');
const jwt=require('jsonwebtoken');
const app=express();
const cookieParser=require('cookie-parser');

// DB connection
require("./db/conn.js");
app.use(cookieParser());

//Router 
app.use(require('./router/auth'));
// app.use(express.json);

//Document Schema
const User=require("./models/userSchema");
const Blog=require("./models/blogSchema");

const port=process.env.PORT || 5000;
app.listen(port,()=>{
    console.log(`server running at port number ${port}`);
    // M0ngoDBAtl@$
    // username:govind
    // password:govind
})
