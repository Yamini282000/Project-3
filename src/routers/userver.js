const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const auth = require('../middleware/auth')

router.get('/login', (req, res) => {
    if (!req.session.successlogin) {
        req.session.loginpage = true
        res.render('login', {
            loginsuccess: req.session.successlogin,
            loginpage: req.session.loginpage,
            error: req.session.error
        })
    } else {
        res.redirect('/');
    }
})

router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.Email,req.body.Password)
        const token = await user.generateAuthToken()
        req.session.user = await User.find({ Email: req.body.Email })
        req.session.successlogin = true
        
        res.redirect('/');
    } catch (e) {
        res.redirect('/login');
    }
})

router.get('/signup', (req, res) => {
    if (!req.session.successlogin) {
        req.session.loginpage = false
        res.render('signup', {
            loginsuccess: req.session.successlogin,
            loginpage: req.session.loginpage,
            error: req.session.error
        })
    }else {
        res.redirect('/');
    }
    
})

router.post('/signup', async (req, res) => {
    
    const data = {
        Fname: req.body.Fname,
        Lname: req.body.Lname,
        Email: req.body.Email,
        Password: req.body.Password,
    }
        const user = new User(data)
    try {
        if (req.body.Password != req.body.RePassword) {
            throw "Password doesn't match!";
            }
            await user.save()
            res.redirect('/login');
        } catch (e) {
            req.session.error = true
            res.redirect('/signup');
        }
})


router.get('/logout', async (req,res) => {
    if (req.session.successlogin) {
        req.session.successlogin = false
        req.session.user = undefined
        res.redirect("/login");
    }
    else {
        res.redirect("*");
    }
})

module.exports = router