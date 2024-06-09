const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const express = require('express');
const { json, urlencoded, Router } = require("express");
const route = express.Router();
route.use(express.json());
route.use(urlencoded({ extended: true }));
require("../db/conn");
const User = require('../models/userSchema');
const Blog = require('../models/blogSchema');
const Authenticate = require("../middleware/Authenticate.js");

route.post("/register", (req, res) => {
    const { author, email, password, city, mobile, jobprofile } = req.body;
    if (!author || !email || !password || !mobile || !city || !jobprofile) {
        return res.status(402).json({ error: "please fill the form properly" });
    }
    User.findOne({ email: email })
        .then((userExist) => {
            if (userExist) {
                return res.status(422).json({ message: "User already exist" });
            }
            let hpassword = bcrypt.hashSync(password, bcrypt.genSaltSync());
            // console.log(hpassword);
            const user = new User({
                author, email, password: hpassword, city, jobprofile, mobile
            });

            user.save().then(() => {
                console.log('success in registeration');
                return res.status(200).json({ message: "Successful registered" });
            }).catch((err) => {
                console.log('failed in Registeration');
                console.log(err);
                return res.status(500).json({ error: "failed in registeration" });
            })
        }).catch((err) => {
            console.log(err);
        })
})

route.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ err: "please fill fields" });
        }
        const userLogin = await User.findOne({ email: email });

        if (userLogin) {
            const isMatch = bcrypt.compareSync(password, userLogin.password);

            if (isMatch) {
                const token = jwt.sign({
                    _id: userLogin._id
                }, 'secret123');
                console.log(token);
                return res.status(200).json({ message: "successfully login", loggedin: token, data: userLogin });
            }
            else {
                return res.status(400).json({ err: "invalid credentials" });
            }
        }
        else {
            return res.status(400).json({ err: "invalid credentials" });
        }
    }
    catch (err) {
        console.log(err);
    }
})

route.post(`/uploadBlog`, (req, res) => {
    try {
        const { heading, url, category, article, author, _id } = req.body;
        if (!heading || !article || !category) {
            return res.status(411).json({ msg: "fill fields properly" });
        }
        let currentDate = new Date().toDateString();
        console.log(currentDate);
        // currentDate =(currentDate).format('DD MM YYYY');
        const blog = new Blog({ date: currentDate, heading, category, article, url, author, author_id: _id });
        blog.save().then(() => {
            console.log("blog uploaded")
            return res.status(200).json({ msg: "Blog uploaded" });
        }).catch((e) => {
            console.log(e);
            return res.json({ err: "error" });
        })
    } catch (e) {
        console.log(e)
    }
})

route.patch(`/follow/:_idd`, async (req, res) => {
    try {
        const token = req.headers['x-access-token'];
        const decode=jwt.verify(token,'secret123');
        const _id=decode._id;
        const id = req.params._idd;
        console.log(id);
        console.log(_id);
        const user = await User.findByIdAndUpdate(_id, {
            $addToSet: {
                followers: id
            }
        });
        res.send("Added to Follower");
    } catch (e) {
        console.log(e);
    }
})


route.get(`/getData`, async (req, res) => {
    const blog = await Blog.find({});
    res.send(blog);
});

route.get(`/getData/:_id`, async (req, res) => {
    const _id = req.params._id;
    const blog = await Blog.findById(_id);
    res.send(blog);
});

route.get(`/getUser`, Authenticate, async (req, res) => {
    res.send(req.rootUser);
});

route.get(`/about`, Authenticate, async (req, res) => {
    try {
        const _id = req.rootUser._id;
        const blog = await Blog.find({ author_id: _id });
        res.send(blog);
    } catch (e) {
        console.log(e);
    }
})
route.get(`/aboutFollow`, Authenticate, async (req, res) => {
    try {
        const _id = req.rootUser.id;
        const blog = await User.findById(_id);
        res.send(blog);
    } catch (e) {
        console.log(e);
    }
})

route.get(`/blog/:_id`, async (req, res) => {
    try {
        const _id = req.params._id;
        const blog = await Blog.find({ author_id: _id });
        res.send(blog);
    } catch (e) {
        console.log(e);
    }
})

route.get(`/About/:_id`, async (req, res) => {
    try {
        const _id = req.params._id;
        const user = await User.findById(_id);
        res.send(user);
    }
    catch (e) {
        console.log(e)
    }
})

route.get(`/blogDetail/:_id`, async (req, res) => {
    try {
        const _id = req.params._id;
        const blog = await Blog.findById(_id);
        res.send(blog);
    }
    catch (e) {
        console.log(e)
    }
})

route.get(`/:category`, async (req, res) => {
    try {
        const category = req.params.category;
        console.log(category);
        // if (category === ":category") {
        //     const blog = await Blog.find({});
        //     res.send(blog);
        // }
        // else {
        //     const blog = await Blog.find({ category: category })
        //     res.send(blog)
        // }
        if(category!==":category"){
            const blog = await Blog.find({category});
            res.send(blog);
        }
        else{
            const blog = await Blog.find({});
                res.send(blog);
        }
    }
    catch (e) {
        console.log(e);
    }
})

route.patch(`/updateBlog/:_id`, async (req, res) => {
    try {
        // const { title, heading, category, article } = req.body;
        const _id = req.params._id;
        console.log(_id);
        const blog = await Blog.findByIdAndUpdate(_id, req.body, {
            new: true
        });
        res.send(blog);
    } catch (e) {
        console.log(e);
    }
})

route.delete(`/delete/:_id`, async (req, res) => {
    try {
        const _id = req.params._id;
        const blog = await Blog.findByIdAndDelete(_id);
        res.send("deleted successfully");
    } catch (e) {
        console.log(e);
    }
})
module.exports = route;
