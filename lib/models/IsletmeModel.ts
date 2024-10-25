import mongoose, { Document, Model, Schema } from "mongoose";
import { Odeme, Proje } from "../types/types";

interface Isletme extends Document {
  unvan: string;
  vergiNo: string;
  yetkili: string;
  adres: string;
  mail: string;
  id: string;
  sistemId: string;
  naceKodu: string;
  notlar?: string;
  tel1?: string;
  tel2?: string;
  uets?: string;
  projeler: Proje[];
}

const OdemeSchema = new Schema<Odeme>({
  destek: {
    type: String,
    required: true,
  },
  durum: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  karekod: {
    type: String,
    required: true,
  },
  projeId: {
    type: String,
    required: true,
  },
  tarih: {
    type: String,
    required: true,
  },
  tutar: {
    type: Number,
    required: true,
  },
});

// Define the Proje schema
const ProjeSchema = new Schema<Proje>({
  baslamaTarihi: {
    type: String,
    required: true,
  },
  durum: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  isletmeId: {
    type: String,
    required: true,
  },
  izleyici: {
    type: String,
    optional: true,
  },
  notlar: {
    type: String,
    optional: true,
  },
  program: {
    type: String,
    required: true,
  },
  sure: {
    type: String,
    required: true,
  },
  takipTarihi: {
    type: String,
    required: true,
  },
  tamamlanmaTarihi: {
    type: String,
    required: true,
  },
  odemeler: [OdemeSchema],
});

const IsletmeSchema = new Schema<Isletme>({
  unvan: {
    type: String,
    required: true,
  },
  vergiNo: {
    type: String,
    required: true,
  },
  yetkili: {
    type: String,
    required: true,
  },
  adres: {
    type: String,
    required: true,
  },
  mail: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  sistemId: {
    type: String,
    required: true,
  },
  naceKodu: {
    type: String,
    required: true,
  },
  notlar: {
    type: String,
    optional: true,
  },
  tel1: {
    type: String,
    optional: true,
  },
  tel2: {
    type: String,
    optional: true,
  },
  uets: {
    type: String,
    optional: true,
  },
  projeler: [ProjeSchema],
});

const IsletmeModel: Model<Isletme> =
  mongoose.models.isletme || mongoose.model<Isletme>("isletme", IsletmeSchema);

export default IsletmeModel;
