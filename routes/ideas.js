const express = require('express');
const mongoose = require('mongoose'); 
const router = express.Router(); 

// Load helper 
const { ensureAuthenticated } = require('../helpers/auth'); 



require('../models/Idea');

const Idea = mongoose.model('ideas'); 

router.get('/', ensureAuthenticated, (req, res) => {
  Idea.find({user: req.user.id})
    .sort({ date: 'desc' })
    .then(ideas => {
      res.render('ideas/index', {
        ideas: ideas,
        author: req.user.name
      });
    });
});

// Add Idea 
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('ideas/add');
});

// Post Idea 

router.post('/', ensureAuthenticated, (req, res) => {
  let errors = [];

  if (!req.body.title) {
    errors.push({ text: 'Please add a title for your idea' });
  } else if (!req.body.details) {
    errors.push({ text: 'Please add details for your idea' });
  }

  if (errors.length > 0) {
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newIdea = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    };

    new Idea(newIdea).save().then(idea => {
      req.flash('success_msg', 'Video Idea Added');
      res.redirect('/ideas');
    });
  }
});

// Edit Form

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    if(idea.user != req.user.id) {
      req.flash('error_msg', 'Not Authorized')
      res.redirect('/ideas')
    } else {
      res.render('ideas/edit', { 
        idea: idea 
      });
    }

  });
});

// Edit Form Process

router.put('/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    idea.title = req.body.title;
    idea.details = req.body.details;
    idea.save().then(idea => {
      req.flash('success_msg', 'Video Idea Updated');
      res.redirect('/ideas');
    });
  });
});

// Delete Idea Proccess

router.delete('/:id', ensureAuthenticated, (req, res) => {
  Idea.remove({
    _id: req.params.id
  }).then(() => {
    req.flash('success_msg', 'Video Idea removed');
    res.redirect('/ideas');
  });
});

module.exports = router; 