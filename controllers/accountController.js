const Account = require('../models/account');
const Balance = require('../models/balance');

exports.createAccount = async (req, res) => {
    try {
        const account = await Account.create(req.body);
        await Balance.create({ accountId: account._id, balance: 0 });
        res.status(201).json(account);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAccounts = async (req, res) => {
    const accounts = await Account.find();
    res.json(accounts);
};

exports.deleteAccount = async (req, res) => {
    await Account.findByIdAndDelete(req.params.id);
    await Balance.deleteOne({ accountId: req.params.id });
    res.json({ message: 'Account deleted' });
};

