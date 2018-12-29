const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');  
const router = express.Router(); 

require('../models/User');

const User = mongoose.model('users'); 

// User Login Route

router.get('/login', (req, res) => {

    res.render('users/login'); 

});

// Register
router.get('/register', (req, res) => {
  res.render('users/register');
});



//Login Form Post

router.post('/login', (req, res, next) => {
    
    passport.authenticate('local', {
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next); 

}); 

// Register Form Post

router.post('/register', (req, res) => {
    let errors = [];

    if(req.body.password !== req.body.password2) {
        errors.push({ text: 'Password does not match' });
    }

    if(req.body.password.length < 5) {
        errors.push({ text: 'Password must contains at least 5 characters' });
    }

    if(errors.length > 0) {

        res.render('users/register', {
            errors: errors,
            nameUser: req.body.nameUser,
            email: req.body.email
        }); 

    } else {
        User.findOne({email: req.body.email})
            .then(user => {
                if(user) {
                    req.flash('error_msg', 'The email is already registered in our database');
                    res.redirect('/users/register'); 
                } else {
                    const newUser = {
                        name: req.body.nameUser,
                        email: req.body.email,
                        password: req.body.password
                    };

                    bcrypt.genSalt(10, (err, salt) => {

                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) {
                                throw err;
                            }
                            newUser.password = hash;
                            new User(newUser)
                                .save()
                                .then(user => {
                                    req.flash('success_msg', 'Congratulations, you have registered successfully');
                                    res.redirect('/users/login');
                                })
                                .catch(err => {
                                    console.log(err);
                                    return;
                                })
                        })
                    });
                }
            })
    }
});

// Logout

router.get('/logout', (req, res) => {
    req.logOut(); 
    req.flash('success_msg', 'You are logged out'); 
    res.redirect('/users/login'); 
}); 


module.exports = router; 