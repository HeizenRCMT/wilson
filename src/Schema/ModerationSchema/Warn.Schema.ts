import { Schema, model } from 'mongoose';

export interface IWarn {
    userId: string;
    guildId: string;
    reason: string;
    moderatorId: string;
    date: Date;
}

const WarnSchema = new Schema<IWarn>({
    userId: { type: String, required: true },
    guildId: { type: String, required: true },
    reason: { type: String, default: "No especificada" },
    moderatorId: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

const WarnModel = model("Warn", WarnSchema);

export default WarnModel;
