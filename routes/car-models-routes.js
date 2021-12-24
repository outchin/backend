const express = require('express');
const { check } = require('express-validator');


const modelsController = require('../controllers/car-models-controllers');

const router = express.Router();



router.post(
    '/addModels',
    [
        check('country'),
        check('brand'),
    ],
    modelsController.addModels
);
router.post(
    '/addModels1',
    [
        check('country'),
        check('brand'),
    ],
    modelsController.addModels1
);



module.exports = router;
