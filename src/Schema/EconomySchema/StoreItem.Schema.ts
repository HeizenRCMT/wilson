import { Schema, model } from 'mongoose';

export interface IStoreItem {
    id: string;
    name: string;
    description: string;
    price: number;
    customizable: boolean;
}

const StoreSchema = new Schema<IStoreItem>({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    customizable: { type: Boolean, default: false },
});

const StoreItem = model<IStoreItem>("StoreItem", StoreSchema);

export default StoreItem;
