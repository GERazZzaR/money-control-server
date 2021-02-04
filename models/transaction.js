const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
  amount: { type: mongoose.Decimal128, required: true },
  date: { type: Date },
  wiederkehrend : { type: String },
  category: { type: String },
  note: { type: String }
});

const Transaction = mongoose.model("Transaction", TransactionSchema);
module.exports = Transaction;