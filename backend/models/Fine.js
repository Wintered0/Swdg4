const  mongoose = require("mongoose");

const fineSchema = new mongoose.Schema({
    fineId: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    transactionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BorrowTransaction",
    },
    amount: Number,
    reason: String,
    paid: Boolean,
});
module.exports = mongoose.model("Fine", fineSchema);
