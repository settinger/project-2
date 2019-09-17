'use strict';

const { Router } = require('express');
const router = Router();



router.get('/:id', (req, res, next) => {
  res.render('map/map', { title: `Look at this dialect map of the word potato ${req.params.id}`});
});



module.exports = router;
