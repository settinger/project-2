'use strict';

const { Router } = require('express');
const router = Router();

router.get('/', (req, res, next) => {
  res.render('map', { title: 'Around the world' });
});

module.exports = router;
