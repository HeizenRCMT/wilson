import { Schema, model } from 'mongoose';

export interface IInventoryItem {
    itemId: string;
    customName?: string;
    customDescription?: string;
    acquiredAt: Date;
}

export interface IUserInventory {
    userId: string;
    items: IInventoryItem[];
}

const UserInventorySchema = new Schema<IUserInventory>({
    userId: { type: String, required: true, unique: true },
    items: [{
        itemId: { type: String, required: true },
        customName: { type: String },
        customDescription: { type: String },
        acquiredAt: { type: Date, default: Date.now }
    }]
});

const UserInventory = model<IUserInventory>("UserInventory", UserInventorySchema);

export default UserInventory;
