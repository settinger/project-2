'use strict';

const { Router } = require('express');
const router = Router();
const User = require('./../models/user');
const bcrypt = require('bcrypt');

