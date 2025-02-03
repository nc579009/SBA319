const Transaction = require('../models/transaction');
const Balance = require('../models/balance');

exports.createTransaction = async (req, res) => {
    try {
        const { accountId, type, amount } = req.body;
        const balance = await Balance.findOne({ accountId });

        if (!balance) return res.status(404).json({ error: 'Account not found' });

        if (type === 'withdrawal' && balance.balance < amount) {
            return res.status(400).json({ error: 'Insufficient funds' });
        }

        const transaction = await Transaction.create(req.body);
        if (type === 'deposit') balance.balance += amount;
        if (type === 'withdrawal') balance.balance -= amount;
        await balance.save();

        res.status(201).json(transaction);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getTransactions = async (req, res) => {
    const transactions = await Transaction.find({ accountId: req.params.accountId });
    res.json(transactions);
};