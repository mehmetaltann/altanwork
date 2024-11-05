import mongoose, { Model, Schema } from "mongoose";
import { Odeme, Proje, Isletme } from "../types/types";

const OdemeSchema = new Schema<Odeme>({
  destek: {
    type: String,
    required: true,
  },
  durum: {
    type: String,
    required: true,
  },
  karekod: {
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
  izleyici: {
    type: String,
  },
  notlar: {
    type: String,
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
  },
  tel1: {
    type: String,
  },
  tel2: {
    type: String,
  },
  uets: {
    type: String,
  },
  projeler: [ProjeSchema],
});

const IsletmeModel: Model<Isletme> =
  mongoose.models?.isletme || mongoose.model<Isletme>("isletme", IsletmeSchema);

export default IsletmeModel;
