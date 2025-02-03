const express = require('express');
const router = express.Router();
const { createAccount, getAccounts, deleteAccount } = require('../controllers/accountController');

router.post('/', createAccount);
router.get('/', getAccounts);
router.delete('/:id', deleteAccount);

module.exports = router;