const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const blogSchema = new mongoose.Schema({

    heading: {
        type: String,
        required: true
    },
    category: {
        type: String,
        // required: true
    },
    url: {
        type: String
    },
    article: {
        type: String,
        required: true
    },
    date:{
      type:String,
        // required:true
    },
    author_id:{
        type:String
    },
    author:{
        type:String
    },
    likes:{
        type:Number,
    }
});

const Blog=new mongoose.model("BLOG",blogSchema);
module.exports=Blog;