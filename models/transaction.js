const transactionSchema = new mongoose.Schema({
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
    type: { type: String, enum: ['deposit', 'withdrawal', 'transfer'], required: true },
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, default: Date.now }
});
transactionSchema.index({ accountId: 1, date: -1 });
module.exports = mongoose.model('Transaction', transactionSchema);