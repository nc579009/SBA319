// DEPENDENCIES
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
//const morgan = require('morgan');
const app = express();

dotenv.config();
app.use(express.json());
//app.use(morgan('dev'));

// DATABASE CONNECTION
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});

// SCHEMAS & MODELS
const accountSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now }
});
const Account = mongoose.model('Account', accountSchema);

const transactionSchema = new mongoose.Schema({
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
    type: { type: String, enum: ['deposit', 'withdrawal', 'transfer'], required: true },
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, default: Date.now }
});
transactionSchema.index({ accountId: 1, date: -1 });
const Transaction = mongoose.model('Transaction', transactionSchema);

const balanceSchema = new mongoose.Schema({
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', unique: true, required: true },
    balance: { type: Number, required: true, min: 0 }
});
const Balance = mongoose.model('Balance', balanceSchema);

// ROUTES
// Create Account
app.post('/accounts', async (req, res) => {
    try {
        const account = await Account.create(req.body);
        await Balance.create({ accountId: account._id, balance: 0 });
        res.status(201).json(account);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get All Accounts
app.get('/accounts', async (req, res) => {
    const accounts = await Account.find();
    res.json(accounts);
});

// Create Transaction
app.post('/transactions', async (req, res) => {
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
});

// Get Transactions for an Account
app.get('/transactions/:accountId', async (req, res) => {
    const transactions = await Transaction.find({ accountId: req.params.accountId });
    res.json(transactions);
});

// Delete Account (also deletes transactions and balance)
app.delete('/accounts/:id', async (req, res) => {
    await Transaction.deleteMany({ accountId: req.params.id });
    await Balance.deleteOne({ accountId: req.params.id });
    await Account.findByIdAndDelete(req.params.id);
    res.json({ message: 'Account deleted' });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
 