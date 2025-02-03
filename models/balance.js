const balanceSchema = new mongoose.Schema({
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', unique: true, required: true },
    balance: { type: Number, required: true, min: 0 }
});
module.exports = mongoose.model('Balance', balanceSchema);