import mongoose, { Model, Schema } from "mongoose";
import { Parameter } from "../types/types";

const ProgramSchema = new Schema<Parameter>({
  isim: {
    type: String,
    required: true,
  },
});

const DestekSchema = new Schema<Parameter>({
  isim: {
    type: String,
    required: true,
  },
});

const SectorSchema = new Schema({
  isim: {
    type: String,
    required: true,
  },
});

export const SectorModel: Model<Parameter> =
  mongoose.models?.sector || mongoose.model<Parameter>("sector", SectorSchema);

export const ProgramModel: Model<Parameter> =
  mongoose.models?.program ||
  mongoose.model<Parameter>("program", ProgramSchema);

export const DestekModel: Model<Parameter> =
  mongoose.models?.destek || mongoose.model<Parameter>("destek", DestekSchema);
