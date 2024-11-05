export type Odeme = {
  _id: string;
  destek: string;
  durum: string;
  karekod: string;
  tarih: string;
  tutar: number;
};

export type OdemeWithoutId = {
  destek: string;
  durum: string;
  karekod: string;
  tarih: string;
  tutar: number;
};

export type Proje = {
  _id: string;
  baslamaTarihi: string;
  durum: string;
  izleyici?: string;
  notlar?: string;
  program?: string;
  sure?: string;
  takipTarihi?: string;
  tamamlanmaTarihi?: string;
  odemeler?: Odeme[];
};

export type ProjeWithoutId = {
  baslamaTarihi: string;
  durum: string;
  izleyici?: string;
  notlar?: string;
  program?: string;
  sure?: string;
  takipTarihi?: string;
  tamamlanmaTarihi?: string;
  odemeler?: Odeme[];
};

export type Isletme = {
  _id: string;
  unvan: string;
  vergiNo: string;
  yetkili?: string;
  adres?: string;
  mail: string;
  sistemId: string;
  naceKodu?: string;
  notlar?: string;
  tel1?: string;
  tel2?: string;
  uets?: string;
  projeler?: Proje[];
};

export type Parameter = {
  _id: string;
  isim: string;
};

export type Sektor = {
  _id: string;
  isim: string;
};

export type DisplayIsletmes = {
  id: string;
  unvan: string;
  vergiNo: string;
  notlar?: string;
  naceKodu?: string;
  mail: string;
  numberOfOdeme: number;
};


export type DisplayProjects = {
  id: string;
  isletmeId: string;
  baslamaTarihi: string;
  gecenGunsayisi: number;
  numberOfOdeme: number;
  durum: string;
  program?: string;
  sure?: string;
  takipTarihi?: string;
  tamamlanmaTarihi?: string;
  unvan: string;
  vergiNo: string;
};

export type DisplayOdemes = {
  id: string;
  isletmeId: string;
  projeId: string;
  unvan: string;
  vergiNo: string;
  program?: string;
  baslamaTarihi: string;
  karekod: string;
  tarih: string;
  tutar: number;
  gecenGunsayisi: number;
  durum: string;
};
