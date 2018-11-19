// ========== Global Dependencies ============ //
const express = require('express');
const router = express.Router();

const homeFunctions = require('./homeFunctions');
const userFunctions = require('./userFunctions');

// Home Routes
router.get('/', homeFunctions.homeMessage);

router.get('/downloadPdf', homeFunctions.pdfDownload);
router.get('/getEmail', homeFunctions.getEmail);

// User Routes
router.get('/users', userFunctions.getAllUsers);

module.exports = router;
