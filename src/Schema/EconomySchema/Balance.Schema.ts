import { Schema, model } from 'mongoose';

interface Balance {
    userId: string;
    hand: number;
    bank: number;
}

const BalanceSchema = new Schema<Balance>({
    userId: { type: String, required: true, unique: true },
    hand: { type: Number, default: 100 },
    bank: { type: Number, default: 0 },
})

const Balance = model("Balance", BalanceSchema);

export default Balance;