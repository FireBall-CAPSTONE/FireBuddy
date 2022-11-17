const express = require('express');
const controller = require('../controllers/pageController');

const router = express.Router();



//GET /stories/new: send html form for creating a new story

router.get('/firedata', controller.firedata);


//GET /stories/:id: send details of story identified by id

router.get('/info', controller.info);

//GET /stories/:id/edit: send html form for editing and existing story

router.get('/predictions', controller.predictions);

module.exports = router;